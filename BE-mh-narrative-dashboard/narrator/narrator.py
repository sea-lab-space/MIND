import asyncio
from copy import deepcopy
import random
import time
from typing import List
from agents import Agent, ModelSettings, Runner
from narrator.agents.rewriter import RewriterNarratorAgent
from synthesizer import (
    CATEGORIES
)
from synthesizer.synthesizer_commons import SYNT_EXAMPLES
from utils.prompt_commons import OPENAI_AGENTIC_REC, OPENAI_AGENTIC_TOOL_USE, OPENAI_AGENTIC_PLANNING, get_mh_data_expert_system_prompt
from utils.search import search_id_in_facts
from utils.tools import retrive_data_facts
from MIND_types import NarratorOutputModel, InsightGuardrailOutputModel

NARRATOR_CATEGORY_THEMES = (
    "Insight themes:\n"
    + "\n".join(f"* {category}" for category in CATEGORIES)
)

NARRATOR_SYSTEM = f"""
You are a mental health clinical narrative generation expert. Your task is to synthesize a coherent and insightful patient narrative from a list of data-driven insights.

Input:
You are given a list of insights in the format:
<|insight_id|>: |insight_description| [|insight themes|]

{NARRATOR_CATEGORY_THEMES}

Goal:
- Select 4 - 6 of the most important insights.
- Sequence them to form a logically connected and clinically meaningful narrative.
- Focus on insights that highlight key patterns, changes, or concerns in the patient’s condition.
- Think step by step to ensure coverage, salience, and narrative coherence.

Output Format (Strict):
Return a list of selected insight_id values, in the order they should appear in the final narrative.

Let's think step by step:
1. Skim all insights.
2. Group and prioritize insights based on clinical impact and interconnection.
3. Select 4 - 6 that best reflect the patient’s current condition and story.
4. Order them to build a clear and logical progression.
5. Return only the list of IDs, in final narrative order.
"""


class ThreaderNarratorAgent:
    OUTPUT_MODEL = NarratorOutputModel

    def __init__(self, model: str):
        self.agent = Agent(
            name=f"Visualizer Narrator Agent",
            model_settings=ModelSettings(temperature=0.2, top_p=0.1),
            model=model,
            output_type=self.OUTPUT_MODEL,
        )

    def _glue_instructions(self):
        return f"""
            {OPENAI_AGENTIC_REC}
            {get_mh_data_expert_system_prompt()}
            {NARRATOR_SYSTEM}
        """


    def _glue_data_insights(self, data_insights):
        for i, insight in enumerate(data_insights):
            # Only assign an ID if no qaid exists
            if insight.get("qaid") is None:
                data_insights[i]["insight_id"] = f"ins-{i}"

        # Build prompt string only from insights without qaid
        prompt_str = "\n".join(
            f"<{insight['insight_id']}>: {insight['insight_description']} "
            f"[{', '.join(insight['insight_category'])}]"
            for insight in data_insights
            if insight.get("qaid") is None
        )

        return prompt_str, data_insights

    async def run(self, data_insights: dict, verbose: bool = False):
        self.agent.instructions = self._glue_instructions()
        if verbose:
            print(data_insights)

        prompt_input, data_insights_ided = self._glue_data_insights(
            data_insights)

        res = await Runner.run(self.agent, prompt_input)
        res_dict = res.final_output.model_dump()
        data_insights_list = res_dict.get("insights")

        # find the original insights based on the ids
        sequenced_data_insights = []
        for i, insight in enumerate(data_insights):
            if "qaid" in insight:
                sequenced_data_insights.append(insight)
        for insight_id in data_insights_list:
            for insight in data_insights_ided:
                if "insight_id" in insight and insight["insight_id"] == insight_id:
                    sequenced_data_insights.append(insight)
                    break
        if verbose:
            print(sequenced_data_insights)
        return sequenced_data_insights

NARRATOR_DEDUPLICATION_SYSTEM = f"""
You are an expert in clinical mental health narrative generation.
Given a |data insight| and its associated |data facts|, identify and deduplicate the facts.

Redundancy may occur:
* Across modalities (e.g., transcripts and clinical notes);
* Within a single modality (e.g., multiple facts of the same type that equally support the insight).
* Within the same category (e.g., similar insights about sleep, emotional state).

Task: Return the IDs of the unique, non-redundant data facts that best support the insight. 
Requirement:
* Preserve the most important supporting data fact for each insight.
* Rank the reduced data facts by their importance to the insight. Assume numerical facts (starts with survey or ps) as more important than textual facts (starts with text).
* Make sure to return at least 1 data fact.
"""

class DeduplicationNarratorAgent:
    OUTPUT_MODEL = List[str]

    def __init__(self, model: str):
        self.agent = Agent(
            name=f"Deduplication agent",
            instructions=NARRATOR_DEDUPLICATION_SYSTEM,
            model_settings=ModelSettings(temperature=0.2, top_p=0.1),
            model=model,
            output_type=self.OUTPUT_MODEL,
        )

    async def run(self, data_insight_descriptions, data_facts, verbose = False):
        prompt_input = f"|data insight|: {data_insight_descriptions}\n|data facts|: {data_facts}"
        res = await Runner.run(self.agent, prompt_input)
        res_list = res.final_output
        if verbose:
            print(f"Reduced: {len(data_facts) - len(res_list)} data facts")
        return res_list

NARRATOR_GUARDRAIL_SYSTEM = f"""
You are an expert in clinical mental health narrative generation.
Given a |data insight| and its associated |data facts|, identify and correct any hallucinations in the insight.

A hallucination refers to any statement, interpretation, or conclusion that goes beyond what is directly supported by the provided data facts. This includes overgeneralization, causal inference, or assumptions not explicitly evidenced in the facts.
One concrete example include:
* If the |data insight| suggests some behaviour persists, it should only refer to |data facts| that explicitly uses numbers.

Task:
* Review the data insight in light of the data facts.
* If you detect hallucination, return a revised version of the data insight with all hallucinations removed or reworded to strictly reflect what the data supports.

When rewriting the insights, follow the guidelines:
* Use the original text if no hallucination is detected.
* Be concrete, specific, but succinct. Do not use more than 12 words for each data insight.
* When hard to describe in less than 12 words, pick the most important insight, that is, the one that is most likely to be the most relevant to the patient's condition and/or backed by data facts.
* Do not explicity mention any date related in the insights.
* Do not start with "Patient", "He/she" or patient name.
* Aviod confusing information. For example, don't say "Physical activity decreased, with brief increases in steps and exercise time", leave one, either "physical activity decreased during <dates>" or "brief increases in steps and excercise time during <dates>".
* Keep only one sentence, and end that sentence with a period.
* Avoid using semicolons to connect sentences.
* Reference the styles given below.

Below are some good examples provided by a mental health expert. Mimic the succinct insight description style and learn from the examples.
* Growing activity despite fatigue.
* Fragmented digital engagement.
* Increased social activity, in a closed circle.
"""

# * Contextualize dates and times, e.g., "for 1 week", "for 3 days". For insights on a specific date, do not mention the year.
# * The general style should follow: <observation> + <contrast/effect>
# * Transient mood lift after activity; discouragement and self-criticism returning within an hour.
# * Maintains work and therapy attendance; finds routine helpful but exhausting.
# * Sertraline taken daily for 1 week with no side effects; benefit remains unclear.

class GuardrailNarratorAgent:
    OUTPUT_MODEL = InsightGuardrailOutputModel

    def __init__(self, model: str):
        self.agent = Agent(
            name=f"Deduplication agent",
            instructions=NARRATOR_GUARDRAIL_SYSTEM,
            model_settings=ModelSettings(temperature=0.2, top_p=0.1),
            model=model,
            output_type=self.OUTPUT_MODEL,
        )

    async def run(self, data_insight_descriptions, data_facts, verbose=False):
        prompt_input = f"|data insight|: {data_insight_descriptions}\n|data facts|: {data_facts}"
        res = await Runner.run(self.agent, prompt_input)
        res = res.final_output.model_dump()
        res_text = res.get("insight")
        if verbose:
            print(f"Original: {data_insight_descriptions}\nRevised: {res_text}\n---")
        return res_text


class Narrator:
    def __init__(self, data_insights_full, data_fact_list, model_name: str = "gpt-4.1"):
        self.agent = ThreaderNarratorAgent(model=model_name)
        self.guardrail_hallucination_agent = GuardrailNarratorAgent(model=model_name)
        self.deduplication_agent = DeduplicationNarratorAgent(model=model_name)
        self.fact_rewriter_agent = RewriterNarratorAgent(model=model_name)
        self.data_insights_full = data_insights_full
        self.data_fact_list = data_fact_list


    def run(self, data_insights: dict, verbose: bool = False):
        data_insights_narrative = asyncio.run(self.agent.run(data_insights, verbose))

        # full_facts_tasks = []
        # tasks = []
        # for insight in data_insights_narrative:
        #     fact_ids = insight["insight_source"]
        #     supporting_facts = []
        #     for fact_id in fact_ids:
        #         source_fact = search_id_in_facts(self.data_fact_list, fact_id)
        #         supporting_facts.append(source_fact)
        #         if source_fact["id"].startswith("qa-"):
        #             full_facts_tasks.append(
        #                 (source_fact, source_fact['spec']['fact_description']))
        #         elif source_fact['modality_type'] == 'text':
        #             full_facts_tasks.append(
        #                 (source_fact, source_fact['fact_text']))
        #         else:
        #             full_facts_tasks.append(
        #                 (source_fact, source_fact['spec']['fact_description']))
        #     tasks.append((
        #         insight,  # we'll update this later
        #         insight['insight_description'],
        #         supporting_facts
        #     ))
        
        # async def run_all_QoS_tasks(agent_type):
        #     dedup_coroutines = [
        #         deepcopy(agent_type).run(desc, facts, verbose=False)
        #         for (_, desc, facts) in tasks
        #     ]
        #     return await asyncio.gather(*dedup_coroutines)
        
        # # Step 1: Guardrail the insights are not hallucincations
        # insight_guardrail_results = asyncio.run(
        #     run_all_QoS_tasks(self.guardrail_hallucination_agent))
        # for (insight, _, _), revised_insight_text in zip(tasks, insight_guardrail_results):
        #     insight['insight_description'] = revised_insight_text
        
        # # Step 2: Deduplicate semantically similar data facts to reduce info overload for L2
        # dedup_results = asyncio.run(
        #     run_all_QoS_tasks(self.deduplication_agent))
        # for (insight, _, _), l2_insight in zip(tasks, dedup_results):
        #     insight['l2_insight_source'] = l2_insight

        # # # sleep 5s
        # print("-- [Narrator] Finished data facts/insights QoS check, waiting fact rewrite")
        # time.sleep(5)

        # # Step 3: Rewrite data fact descriptions for better readibility
        # async def run_all_rewriting_tasks():
        #     rewrite_coroutines = [
        #         deepcopy(self.fact_rewriter_agent).run(fact, verbose=False)
        #         for (_, fact) in full_facts_tasks
        #     ]
        #     return await asyncio.gather(*rewrite_coroutines)
        # rewrite_results = asyncio.run(run_all_rewriting_tasks())
        # for (fact, _), rewritten_fact in zip(full_facts_tasks, rewrite_results):
        #     if fact["id"].startswith("qa-"):
        #         fact['spec']['fact_description'] = rewritten_fact
        #     elif fact['modality_type'] == 'text':
        #         fact['fact_text'] = rewritten_fact
        #     else:
        #         fact['spec']['fact_description'] = rewritten_fact

        # new_fact_list = [fact for (fact, _) in full_facts_tasks]


        # # time.sleep(10)
        # return data_insights_narrative, new_fact_list
        
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

        # Placeholder for guardrail/deduplication results (no agent runs)
        for (insight, _, _) in tasks:
            print(insight)
            if 'l2_insight_source' not in insight:
                insight['l2_insight_source'] = insight['insight_source']

        print("-- [Narrator] Skipped QoS agent checks, waiting fact rewrite")
        time.sleep(5)

        # Placeholder for rewriting step (no agent runs)
        new_fact_list = [fact for (fact, _) in full_facts_tasks]

        # time.sleep(10)
        return data_insights_narrative, new_fact_list
