

import asyncio
from collections import Counter
from copy import deepcopy
import json
import os
import random
from scipy.stats import entropy
import numpy as np

from tqdm import trange
from synthesizer.synthesizer_agents.actor import InsightProposalActorAgent

from synthesizer.synthesizer_agents.question_to_insight_agent import Q2IAgent
from synthesizer.synthesizer_agents.reflection import InsightReflectionAgent
from utils.datetime_checker import date_between

random.seed(42)

class Synthesizer:
    def __init__(self, data_fact_source, retrospect_date, before_date, model_name):
        self.fact_count = 0
        self.before_date = before_date
        self.retrospect_date = retrospect_date
        self.data_fact_source = data_fact_source
        self.data_fact_list = self._flatten_tag_source()
        self.data_fact_id_set = set([fact["id"] for fact in self.data_fact_list])

        self.q2i_agent = Q2IAgent(model_name)
        
        self.actor_agent = InsightProposalActorAgent(self.data_fact_list, model_name)
        self.reflection_agent = InsightReflectionAgent(model_name)
        self.reflection_mem = []

    def _tag_qa_facts(self, qa_fact_list):
        fact_list = []
        for question in qa_fact_list:
            # print(question)
            for fact in question["evidences"]:
                fact_list.append({
                    "id": f"qa-{self.fact_count}",
                    "spec": {
                        **fact,
                    }
                })
                # also add this id to the original fact
                fact["id"] = f"qa-{self.fact_count}"
                self.fact_count += 1
        
        return fact_list

    def _flatten_tag_numeric(self, num_fact_list):
        id_map = {
            "passive sensing": "ps",
            "survey": "sv"
        }

        fact_list = []
        for facts in num_fact_list:
            for fact in facts["data_facts"]:

                def is_include_fact(fact):
                    if fact['fact_type'] == 'difference' or fact['fact_type'] == 'trend' or fact['fact_type'] == 'derived value':
                        return date_between(fact['time_2'], self.retrospect_date, self.before_date)
                    elif fact['fact_type'] == 'extreme':
                        return date_between(fact['time'], self.retrospect_date, self.before_date)
                    elif fact['fact_type'] == 'comparison':
                        return date_between(fact['time_dur_2']['time_start'], self.retrospect_date, self.before_date)
                    else:
                        TypeError("Unknown fact type")
                        return False

                if is_include_fact(fact):
                    fact_list.append({
                        "id": f"{id_map[facts['modality_type']]}-{facts['modality_source']}-{self.fact_count}",
                        "modality_type": facts["modality_type"],
                        "modality_source": facts["modality_source"],
                        # <bluetooth: uniquedevices> Format: fact description
                        "full_description": f"<{facts['modality_type']}: "
                                            f"{facts['feature_name'] if facts['modality_type'] == 'survey' else facts['modality_source'] + ' ' + facts['feature_name']}> "
                                            f"{fact['fact_description']}",
                        "spec": {
                            **fact,
                        }
                    })
                    self.fact_count += 1
        return fact_list
    
    def _tag_text(self, modality, text_list):
        txt_map = {
            "note_facts": "clinical note",
            "transcript_facts": "session transcript"
        }
        for text in text_list:
            text["id"] = f"text-{modality}-{self.fact_count}"
            text["modality_type"] = "text"
            text["modality_source"] = txt_map[modality]
            text["full_description"] = f"<Text: {txt_map[modality]}> {text['fact_text']} on {', '.join([evi['date'] for evi in text['evidence']])}"
            self.fact_count += 1
        return text_list

    def _flatten_tag_source(self):
        facts = []
        for key, value in self.data_fact_source.items():
            if key == "numeric_facts":
                numeric_fact_list = self._flatten_tag_numeric(value)
                facts.extend(numeric_fact_list)
            # elif key == "note_facts" or key == "transcript_facts":
            #     text_fact_list = self._tag_text(key, value)
            #     facts.extend(text_fact_list)
            elif key == "key_concern_facts":
                qa_fact_list = self._tag_qa_facts(value)
                facts.extend(qa_fact_list)
            else:
                continue
        # print(facts)
        return facts
    
    def _glue_data_fact_input(self, data_fact_set):

        # set fixed randomizer to shuffle data facts
        # ! Is this better than keep original ordering (where same modality facts come in order)?
        data_fact_list = [
            fact for fact in self.data_fact_list
            if not fact["id"].startswith("qa-") and fact["id"] in data_fact_set
        ]
        random.shuffle(data_fact_list)

        prompt_text_list = []
        for fact in data_fact_list:
            # print(fact)
            prompt_text_list.append(
                f"[{fact['id']}] {fact['full_description']}"
            )

        # print(prompt_text_list)
        return "\n".join(prompt_text_list)
    

    def _shuffle_insight(self, data_insights):
        mm_entropies = []
        for insight in data_insights:
            insights_sources = insight["insight_source"]
            modality_origin = Counter()  # e.g., sv, ps, ...
            modality_type = Counter()    # e.g., survey, location, steps, ...

            for insight_source in insights_sources:
                source_list = insight_source.split("-")
                if len(source_list) >= 2:
                    modality_origin[source_list[0]] += 1
                    modality_type[source_list[1]] += 1

            # Convert counts to probability distributions
            origin_counts = np.array(list(modality_origin.values()))
            origin_probs = origin_counts / origin_counts.sum()

            type_counts = np.array(list(modality_type.values()))
            type_probs = type_counts / type_counts.sum()

            # Calculate entropy (in bits; change base=2 if desired)
            entropy_origin = entropy(origin_probs)
            entropy_type = entropy(type_probs)

            # Weighted (balanced) entropy
            alpha = 0.5
            mm_entropy = alpha * entropy_origin + (1 - alpha) * entropy_type
            # insight["entropy"] = mm_entropy
            mm_entropies.append(mm_entropy)
            
        # Sort by entropy descending
        # return sorted(data_insights, key=lambda x: x["entropy"], reverse=True), np.mean(mm_entropies)
        return data_insights, np.mean(mm_entropies)

    def _compute_coverage(self, data_insights):
        used_insight_id_set = set(
            [source for insight in data_insights for source in insight["insight_source"]])
        coverage = len(used_insight_id_set) / len(self.data_fact_list)
        return used_insight_id_set, coverage
    
    def _run_single_modal_synthesis(self, iters=2):
        full_insight_id_set = set(deepcopy(self.data_fact_id_set))
        data_insights = []
        coverage = 0
        insight_entropy = 0
        insight_num = 0
        
        pbar = trange(iters, desc="Initializing...")
        for iter in pbar:
            mem_str = "\n".join(self.reflection_mem)
            mem_str_recent = self.reflection_mem[-1] if self.reflection_mem else ""
            
            # Step 1: Actor run
            prompt = f"""
                Below are all the data facts.
                {self._glue_data_fact_input(full_insight_id_set)}

                Previously generated insights:
                {data_insights}
                
                The most recent reflection:
                {mem_str_recent}
            """
            data_insights_single_run = self.actor_agent.run(prompt, False)
            data_insights = data_insights_single_run
            
            # Step 2: Evaluator run
            # * Assign entropy to data facts used to infer insights
            # * Calculate coverage and determine which data facts has not yet being considered
            data_insights, entp_num = self._shuffle_insight(data_insights)
            used_set, cover = self._compute_coverage(data_insights)

            coverage = cover
            insight_entropy = entp_num
            insight_num = len(data_insights)
            
            # Step 3: Reflection run
            # optimize coverage (consider insights that are not used), entropy (use multimodal insight)
            reflection = asyncio.run(self.reflection_agent.run(
                self._glue_data_fact_input(full_insight_id_set),
                data_insights,
                coverage=cover,
                history=mem_str,
                verbose=False))
            self.reflection_mem.append(reflection)

            pbar.set_description(
                f"Coverage: {coverage:.2f}, Entropy: {insight_entropy:.2f}, # Insights: {insight_num}")
        return data_insights
    
    def _run_qa_synthesis(self, verbose: bool = False):
        key_concern_facts = self.data_fact_source['key_concern_facts']
        all_qa_insights = []
        count = 0
        for key_concern in key_concern_facts:
            evidences = key_concern['evidences']
            res = self.q2i_agent.run(evidences, verbose = True)
            # if len(res) != 1:
            #     print(res)
            #     print(evidences)
            #     raise ValueError("Something wrong with the QA agent")

            for r in res:
                r['qaid'] = key_concern['qaid']
            all_qa_insights.extend(res)
            count += 1
            # break
        # print(len(key_concern_facts))
        return all_qa_insights
    
    def _save(self, path, content):
        with open(path, "w", encoding="utf-8") as f:
            json.dump(content, f, indent=2, ensure_ascii=False)

    def _load(self, path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
        
    def run(self, run_stages = {}, cache_dir = None, iters=2):
        # Default run_stages if None
        if run_stages == {} or cache_dir is None:
            run_stages = {
                "qa_insights": True,
                "simple_insights": True,
            }
        # create cache dir if not exists
        if cache_dir:
            os.makedirs(cache_dir, exist_ok=True)
        
        if run_stages["qa_insights"]:
            qa_insights = self._run_qa_synthesis(verbose=True)
            self._save(os.path.join(cache_dir, 'note_facts.json'), qa_insights)
        else:
            # read from file
            qa_insights = self._load(os.path.join(cache_dir, 'note_facts.json'))

        if run_stages["simple_insights"]:
            additional_insights = self._run_single_modal_synthesis(iters)
            self._save(os.path.join(cache_dir, 'additional_facts.json'), additional_insights)
        else:
            additional_insights = self._load(os.path.join(cache_dir, 'additional_facts.json'))
        
        data_insights = qa_insights + additional_insights
        return data_insights

