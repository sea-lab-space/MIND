import asyncio
from copy import deepcopy
import json
import os
from typing import Literal
from tqdm import tqdm

from discoverer.rule_base_agents.rule_base_comparison_agent import RuleBaseComparisonAgent
from discoverer.rule_base_agents.rule_base_trend_agent import RuleBaseTrendAgent
from discoverer.rule_base_agents.rule_base_outlier_agent import RuleBaseOutlierAgent
from discoverer.planner import PlannerAgent
from discoverer.text_data.hypothesis_agent import DiscovererHypothesisAgent
from helpers.notes_summary_agent import NotesCardSummaryAgent
from utils.search import search_feature_in_feature_list, search_question_in_question_list

class Discoverer:
    def __init__(self, numeric_agents, two_session_aback_date, retrospect_date, before_date, model_name):
        # all agents have the same base class
        self.numeric_agents = [
            agent(
                retrospect_date = retrospect_date, 
                before_date = before_date, 
                model=model_name) for agent in numeric_agents
        ]
        # differentiate by agent name
        # self.text_agents = [
        #     agent(retrospect_date, before_date, model=model_name) for agent in text_agents
        # ]
        self.hypothesis_agent = DiscovererHypothesisAgent(
            before_date=before_date,
            retrospect_date=retrospect_date,
            model=model_name)
        self.planning_agent = PlannerAgent(
            before_date=before_date,
            retrospect_date=retrospect_date,
            model=model_name
        )
        self.before_date = before_date
        self.retrospect_date = retrospect_date
        self.two_session_aback_date = two_session_aback_date

    async def _async_run_numeric_discovery(self, feature_list, is_testing):
        if is_testing:
            feature_list = feature_list[:1]

        tasks = []
        for discoverer in self.numeric_agents:
            for feature in feature_list:
                tasks.append((deepcopy(discoverer), feature))

        async def run_task(discoverer, feature):
            result = await discoverer.run(feature, verbose=False)
            return discoverer, feature, result

        coroutines = [run_task(d, f) for d, f in tasks]
        results = await asyncio.gather(*coroutines)

        data_facts = []
        for _, feature, data_fact in results:
            if data_fact:
                data_facts.append({
                    "modality_type": feature['modality_type'],
                    "modality_source": feature['modality_source'],
                    "feature_name": feature['feature_name_renamed'],
                    "data_facts": data_fact
                })
        return data_facts

    def _run_numeric_discovery(self, feature_list, is_testing):
        return asyncio.run(self._async_run_numeric_discovery(feature_list, is_testing))
    
    # def _run_single_modal_discovery(self, feature_list):
    #     outlier_agent = RuleBaseOutlierAgent(
    #         start_date=self.retrospect_date,
    #         end_date=self.before_date,
    #     )
    #     for feature in feature_list:
    #         outlier_agent.run(feature['data'])
    
    # def _run_text_discovery(self, text_type: Literal['clinical note', 'clinical transcript'], context: str):
    #     running_agent = None
    #     for text_agent in self.text_agents:
    #         if text_agent.modality_source == text_type:
    #             running_agent = text_agent
    #     assert running_agent is not None, "No text agent found for the given modality type"

    #     res = asyncio.run(running_agent.run(context, verbose=False))
    #     return res

    
    def _prep_transcript(self, text_input):
        matching_feat = next(
            (feat['transcript'] for feat in text_input if feat['encounter_date']
             == self.retrospect_date),
            None
        )
        if matching_feat:
            formatted_transcript = "\n".join(
                f"Clinician: {turn['clinician']}\nPatient: {turn['patient']}"
                for turn in matching_feat
            )
        else:
            formatted_transcript = None

        # Build the result dictionary
        transcript_input = {self.retrospect_date: formatted_transcript}
        return transcript_input
    

    
    def _run_hypothesis_generation(self, transcript_input, note_input, verbose = False):
        print("---- Running Hypothesis Generation ----")
        questions = self.hypothesis_agent.run(
            session_transcripts=transcript_input,
            clinical_notes=note_input,
            verbose=False
        )
        return questions
    
    def _run_planning(self, questions, numeric_input, verbose = False):
        print("---- Running Planning and Discovery ----")

        execution_plan = self.planning_agent.run(
            questions, numeric_input, verbose=False)
        for i in range(len(execution_plan)):
            execution_plan[i]['qaid'] = f"qaid-{i+1}"

        return execution_plan
    
    def _run_execution(self, execution_plan, numeric_input, questions, verbose = False):
        trend_rule_base_agent = RuleBaseTrendAgent(
            start_date=self.retrospect_date,
            end_date=self.before_date,
        )
        comparison_rule_base_agent = RuleBaseComparisonAgent(
            start_date=self.two_session_aback_date,
            retrospect_date=self.retrospect_date,
            end_date=self.before_date,
        )
        outlier_rule_base_agent = RuleBaseOutlierAgent(
            start_date=self.retrospect_date,
            end_date=self.before_date,
        )
        agents = [comparison_rule_base_agent, trend_rule_base_agent, outlier_rule_base_agent]

        key_concern_facts = []
        for plan in execution_plan:
            question_text = plan['question_text']
            data_facts = []
            for feature_name in plan['features']:
                data = search_feature_in_feature_list(
                    numeric_input, feature_name)
                for agent in agents:
                    res = agent.run(data['data'], verbose=verbose)
                    # if res is a list, extend, else append
                    if isinstance(res, list):
                        data_facts.extend(res)
                    else:
                        data_facts.append(res)
            q_source, q_action = search_question_in_question_list(
                questions, question_text
            )
            key_concern_facts.append({
                "qaid": plan['qaid'],
                "question_text": question_text,
                "action": q_action,
                "question_source": q_source,
                "evidences": data_facts
            })
        return key_concern_facts


    def run(self, features, cache_dir: str = "", run_stages: dict = None, is_testing: bool = False):
        """
        Orchestrates the pipeline with stage controls.
        Stages:
        - notes_summary
        - hypothesis_generation
        - plan
        - exec
        - fact_exploration (numeric discovery)
        """

        # Default run_stages if None
        if run_stages == {} or cache_dir is None:
            run_stages = {
                "hypothesis_generation": True,
                "plan": True,
                "exec": True,
                "fact_exploration": True
            }
        # create cache dir if not exists
        if cache_dir:
            os.makedirs(cache_dir, exist_ok=True)

        # Extract text inputs
        text_input = features['this_series']
        note_input = {
            self.retrospect_date: next((
                feat['clinical_note']
                for feat in text_input if feat['encounter_date'] == self.retrospect_date),
                None)
        }
        transcript_input = self._prep_transcript(text_input)

        # Sanity check
        assert len(note_input) > 0 and len(
            transcript_input) > 0, "No text data found for the given date"

        # Stage 2: Hypothesis generation
        numeric_input = features['numerical_data']
        if run_stages["hypothesis_generation"]:
            print("[Discoverer run]: Running Hypothesis Generation")
            questions = self._run_hypothesis_generation(
                transcript_input, note_input, verbose=False)
            if cache_dir:
                with open(os.path.join(cache_dir, 'questions.json'), 'w') as f:
                    json.dump(questions, f, indent=2)
        else:
            with open(os.path.join(cache_dir, 'questions.json'), 'r') as f:
                questions = json.load(f)

        # Stage 3: Planning / key concerns
        # Stage 3a: Planning
        if run_stages["plan"]:
            print("[Discoverer run]: Running Planning")
            execution_plan = self._run_planning(
                questions, numeric_input, verbose=False)
            if cache_dir:
                with open(os.path.join(cache_dir, 'execution_plan.json'), 'w') as f:
                    json.dump(execution_plan, f, indent=2)
        else:
            with open(os.path.join(cache_dir, 'execution_plan.json'), 'r') as f:
                execution_plan = json.load(f)

        # Stage 3b: Execution
        if run_stages["exec"]:
            print("[Discoverer run]: Running Execution")
            key_concern_facts = self._run_execution(
                execution_plan, numeric_input, questions, verbose=False)
            if cache_dir:
                with open(os.path.join(cache_dir, 'key_concern_facts.json'), 'w') as f:
                    json.dump(key_concern_facts, f, indent=2)
        else:
            with open(os.path.join(cache_dir, 'key_concern_facts.json'), 'r') as f:
                key_concern_facts = json.load(f)

        # Stage 4: Numeric discovery (fact exploration)
        numeric_facts = []
        if run_stages["fact_exploration"]:
            print("[Discoverer run]: Running Fact Exploration")
            if len(self.numeric_agents) > 0:
                print("---- Running Numerical Data Fact Discovery ----")
                numeric_facts = self._run_numeric_discovery(
                    numeric_input, is_testing)
                if cache_dir:
                    with open(os.path.join(cache_dir, 'numeric_facts.json'), 'w') as f:
                        json.dump(numeric_facts, f, indent=2)
            else:
                print("---- Skipping Numerical Data Fact Discovery ----")
        else:
            # Load from cache if skipping
            with open(os.path.join(cache_dir, 'numeric_facts.json'), 'r') as f:
                numeric_facts = json.load(f)

        # Return all discovered facts
        return {
            "numeric_facts": numeric_facts,
            "key_concern_facts": key_concern_facts,
            # "transcript_facts": transcript_facts,
            # "medication_facts": medication_facts
        }
