import asyncio
from copy import deepcopy
import json
import os
import time
from narrator.agents.deduplicator import DeduplicationNarratorAgent
from narrator.agents.guardrail import GuardrailNarratorAgent
from narrator.agents.question_insight_answer import RewriterQIAAgent
from narrator.agents.rewriter import RewriterNarratorAgent
from narrator.agents.simple_insight import RewriterSimpleInsightAgent
from narrator.agents.threader import ThreaderNarratorAgent
from utils.search import search_evidence, search_id_in_facts, search_question


class Narrator:
    def __init__(self, data_insights_full, data_fact_list, model_name: str = "gpt-4.1"):
        self.threader_agent = ThreaderNarratorAgent(model=model_name)
        self.simple_insight_agent = RewriterSimpleInsightAgent(
            model=model_name)
        self.deduplication_agent = DeduplicationNarratorAgent(model=model_name)
        self.fact_rewriter_agent = RewriterNarratorAgent(model=model_name)
        self.qia_agent = RewriterQIAAgent(model=model_name)
        self.data_insights_full = data_insights_full
        self.data_fact_list = data_fact_list

    def _save(self, path, content):
        with open(path, "w", encoding="utf-8") as f:
            json.dump(content, f, indent=2, ensure_ascii=False)

    def _load(self, path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
        
    def run(self, data_insights: dict, questions, run_stages={}, cache_dir=None, verbose: bool = False):
        # Default run_stages if None
        if run_stages == {} or cache_dir is None:
            run_stages = {
                "thread": True,
                "guardrail_qa": True,
                "guardrail_simple_insight": True,
                "fact_rewrite": True,
                "fact_deduplication": True
            }
        # create cache dir if not exists
        if cache_dir:
            os.makedirs(cache_dir, exist_ok=True)
        
        
        # Step 1: thread
        if run_stages["thread"]:
            data_insights_narrative = asyncio.run(
                self.threader_agent.run(data_insights, verbose))
            self._save(os.path.join(cache_dir, "data_insights_threaded.json"), data_insights_narrative)
        else:
            data_insights_narrative = self._load(os.path.join(cache_dir, "data_insights_threaded.json"))
        
        # Step 2: guardrail - this stage only checks qa insights (no need to check simpler insights)
        if run_stages["guardrail_qa"]:
            for insight in data_insights_narrative:
                if "qaid" in insight:
                    question = search_question(questions, insight['qaid'])
                    description = insight["insight_description"]
                    insight["insight_description"] = self.qia_agent.run(
                         question, description, verbose=True)
            self._save(os.path.join(cache_dir, "data_insights_guardrail_qa.json"), data_insights_narrative)
        else:
            data_insights_narrative = self._load(os.path.join(cache_dir, "data_insights_guardrail_qa.json"))

        # Step 3: guardrail - this stage only checks simpler insights (no need to check qa insights)
        if run_stages["guardrail_simple_insight"]:
            for insight in data_insights_narrative:
                if "qaid" not in insight:
                    description = insight["insight_description"]
                    insight["insight_description"] = self.simple_insight_agent.run(
                        description, verbose=True)
            self._save(os.path.join(cache_dir, "data_insights_guardrail_simple_insight.json"), data_insights_narrative)
        else:
            data_insights_narrative = self._load(os.path.join(cache_dir, "data_insights_guardrail_simple_insight.json"))

        full_facts_tasks = []
        tasks = []
        for insight in data_insights_narrative:
            fact_ids = insight["insight_source"]
            supporting_facts = []
            for fact_id in fact_ids:
                source_fact = search_id_in_facts(self.data_fact_list, fact_id)
                supporting_facts.append(source_fact)
                if source_fact["id"].startswith("qa-"):
                    full_facts_tasks.append(
                        (source_fact, source_fact['spec']['fact_description']))
                elif source_fact['modality_type'] == 'text':
                    full_facts_tasks.append(
                        (source_fact, source_fact['fact_text']))
                else:
                    full_facts_tasks.append(
                        (source_fact, source_fact['spec']['fact_description']))
            tasks.append((
                insight,  # we'll update this later
                insight['insight_description'],
                supporting_facts
            ))
        # Step 4: fact rewrite
        if run_stages["fact_rewrite"]:
            print("-- [Narrator] Running fact rewrite")
            async def run_all_rewriting_tasks():
                rewrite_coroutines = [
                    deepcopy(self.fact_rewriter_agent).run(fact, verbose=False)
                    for (_, fact) in full_facts_tasks
                ]
                return await asyncio.gather(*rewrite_coroutines)
            rewrite_results = asyncio.run(run_all_rewriting_tasks())
            for (fact, _), rewritten_fact in zip(full_facts_tasks, rewrite_results):
                if fact["id"].startswith("qa-"):
                    fact['spec']['fact_description'] = rewritten_fact
                elif fact['modality_type'] == 'text':
                    fact['fact_text'] = rewritten_fact
                else:
                    fact['spec']['fact_description'] = rewritten_fact

            new_fact_list = [fact for (fact, _) in full_facts_tasks]
            self._save(os.path.join(cache_dir, "data_fact_list_rewritten.json"), new_fact_list)
        else:
            new_fact_list = self._load(os.path.join(cache_dir, "data_fact_list_rewritten.json"))
        
        time.sleep(10)
        # Step 5: Deduplication
        if run_stages["fact_deduplication"]:
            async def run_all_QoS_tasks(agent_type):
                dedup_coroutines = [
                    deepcopy(agent_type).run(desc, facts, verbose=False)
                    for (_, desc, facts) in tasks
                ]
                return await asyncio.gather(*dedup_coroutines)

            # Step 2: Deduplicate semantically similar data facts to reduce info overload for L2
            dedup_results = asyncio.run(
                run_all_QoS_tasks(self.deduplication_agent))
            for (insight, _, _), l2_insight in zip(tasks, dedup_results):
                insight['l2_insight_source'] = l2_insight
            self._save(os.path.join(cache_dir, "data_fact_deduplication.json"), data_insights_narrative)
        else:
            data_insights_narrative = self._load(os.path.join(cache_dir, "data_fact_deduplication.json"))


        # for (insight, _, _) in tasks:
        #     print(insight)
        #     if 'l2_insight_source' not in insight:
        #         insight['l2_insight_source'] = insight['insight_source']


        
        return data_insights_narrative, new_fact_list
