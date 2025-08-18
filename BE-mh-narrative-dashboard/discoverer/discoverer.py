import asyncio
from copy import deepcopy
import json
from typing import Literal
from tqdm import tqdm

from discoverer.rule_base_agents.rule_base_comparison_agent import RuleBaseComparisonAgent
from discoverer.rule_base_agents.rule_base_trend_agent import RuleBaseTrendAgent
from discoverer.planner import PlannerAgent
from discoverer.text_data.hypothesis_agent import DiscovererHypothesisAgent
from utils.search import search_feature_in_feature_list, search_question_in_question_list

class Discoverer:
    def __init__(self, numeric_agents, text_agents, two_session_aback_date, retrospect_date, before_date, model_name):
        # all agents have the same base class
        self.numeric_agents = [
            agent(
                question="",
                retrospect_date = retrospect_date, 
                before_date = before_date, 
                model=model_name) for agent in numeric_agents
        ]
        # differentiate by agent name
        self.text_agents = [
            agent(retrospect_date, before_date, model=model_name) for agent in text_agents
        ]
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
    
    def _run_text_discovery(self, text_type: Literal['clinical note', 'clinical transcript'], context: str):
        running_agent = None
        for text_agent in self.text_agents:
            if text_agent.modality_source == text_type:
                running_agent = text_agent
        assert running_agent is not None, "No text agent found for the given modality type"

        res = asyncio.run(running_agent.run(context, verbose=False))
        return res

    
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
    
    def run(self, features, is_testing = False):
        # Find fact from text data
        text_input = features['this_series']
        # extract on exact date
        note_input = {
            self.retrospect_date: next((
                feat['clinical_note']
                for feat in text_input if feat['encounter_date'] == self.retrospect_date), 
                None)}
        transcript_input = self._prep_transcript(text_input)

        # assert both should not be a empty dict
        assert len(note_input) > 0 and len(
            transcript_input) > 0, "No text data found for the given date"
        
        # Thread 1: Generate past session FACTUAL summary
        if len(self.text_agents) > 0:
            print("---- Running Text Data Fact Discovery ----")
            note_facts = self._run_text_discovery('clinical note', note_input)
            transcript_facts = self._run_text_discovery(
                'clinical transcript', transcript_input)
        else:
            print("---- Skipping Text Data Fact Discovery ----")
            note_facts = []
            transcript_facts = []
        
        # Thread 2: Generate hypothesis and evidence
        numeric_input = features['numerical_data']
        print("---- Running Hypothesis Generation ----")
        # questions = self.hypothesis_agent.run(
        #     session_transcripts=transcript_input,
        #     clinical_notes=note_input,
        #     verbose=True
        # )
        # # write questions to file
        # with open("questions.json", "w", encoding='utf-8') as f:
        #     json.dump(questions, f, ensure_ascii=False, indent=2)
        # load questions.json
        with open("questions.json", "r", encoding='utf-8') as f:
            questions = json.load(f)
        # execution_plan = self.planning_agent.run(questions, numeric_input, verbose=False)
        # # save plan to file
        # with open("execution_plan.json", "w", encoding='utf-8') as f:
        #     json.dump(execution_plan, f, ensure_ascii=False, indent=2)

        # read plan from file
        with open("execution_plan.json", "r", encoding='utf-8') as f:
            execution_plan = json.load(f)

        trend_rule_base_agent = RuleBaseTrendAgent(
            start_date=self.retrospect_date,
            end_date=self.before_date,
        )
        comparison_rule_base_agent = RuleBaseComparisonAgent(
            start_date=self.two_session_aback_date,
            retrospect_date=self.retrospect_date,
            end_date=self.before_date,
        )
        discovererMap = {
            "comparison": comparison_rule_base_agent,
            "trend": trend_rule_base_agent
        }

        key_concern_facts = []
        for plan in execution_plan:
            question_text = plan['question_text']
            data_facts = []
            for spec in plan['planner_spec']:
                feature_name = spec['feature_name']
                data = search_feature_in_feature_list(
                  numeric_input, feature_name)
                running_agent = discovererMap[spec['fact_type']]
                res = running_agent.run(data['data'], verbose=False)
                data_facts.append(res)
            key_concern_facts.append({
                "question_text": question_text,
                "question_source": search_question_in_question_list(
                    questions, question_text
                ),
                "evidences": data_facts
            })
        print(key_concern_facts)

                



        exit()
        
        # Thread 3: Observe anomalies likely ignored by previous threads that are great talking points
        if len(self.numeric_agents) > 0:
            print("---- Running Numerical Data Fact Discovery ----")
            # Find fact from time series data

            numeric_facts = self._run_numeric_discovery(numeric_input, is_testing)
        else:
            print("---- Skipping Numerical Data Fact Discovery ----")

        return {
            "numeric_facts": numeric_facts,
            "note_facts": note_facts,
            "key_concern_facts": key_concern_facts
            
            # "transcript_facts": transcript_facts,
            # "medication_facts": medication_facts
        }