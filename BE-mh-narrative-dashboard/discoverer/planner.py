import asyncio
from copy import deepcopy
from typing import List
from utils.prompt_commons import (
    OPENAI_AGENTIC_REC,
    OPENAI_AGENTIC_TOOL_USE,
    OPENAI_AGENTIC_PLANNING,
    get_mh_data_expert_system_prompt,
)
from agents import Agent, ModelSettings, RunContextWrapper, Runner, function_tool, handoff, trace
from MIND_types import (
    DiscovererPlannerOutput,
)
from discoverer import (
    TrendDiscovererAgent
)
from kb.defs import NUMERICAL_FEATURE_KB
from utils.search import search_feature_in_feature_list

ALL_FEATURE_DESCRIPTION = "\n".join(
    f"[{category}] {feature['rename']}: {feature['description']}" for category, features in NUMERICAL_FEATURE_KB.items() for _, feature in features.items()
)

# {OPENAI_AGENTIC_PLANNING}{OPENAI_AGENTIC_TOOL_USE}
DISCOVERER_PLANNER_INST = f"""
{OPENAI_AGENTIC_REC}

{get_mh_data_expert_system_prompt()}

You will be given a question that a clinician want to know before the start of the mental health session.
The patient has provided multiple data modalities. In triplebacktics below, you are given all the features and definitions in the form of [<feature category>] <feature name>: <feature description>.
```
{ALL_FEATURE_DESCRIPTION}
```
Key connections to keep in mind:
- Medication outcomes → commonly measured by survey scores: PHQ-4, PHQ-4 Depression, PHQ-4 Anxiety, PSS-4, Positive Affect, Negative Affect.
- Mood outcomes → commonly measured by the same survey scores.
- Biological measurements → commonly evaluated using passive sensing data: sleep, screen, location, steps.

Facts you can compute:
- `comparison` – Evaluate how feature values before the last session differ from values since the last session until today.
- `trend` – Assess the overall trajectory of features since the last session to identify improvements, declines, or stability.

Act in two phases:
1. Check computability  
   - If the question cannot be answered with available data, set `is_computable = false`.
2. If computable, plan the answer
   - Set `is_computable = true`.  
   - For each relevant feature, define:  
     - `fact_type` → what type of data fact is needed (`comparison`, `trend`).  
     - `feature_name` → the exact feature from the knowledge base.  
   - Each unique (fact_type, feature_name) pair should be a separate entry in `planner_spec`.

Let's think step by step.
"""

class PlannerAgent:

    OUTPUT_MODEL = DiscovererPlannerOutput

    def __init__(self, retrospect_date: str, before_date: str, model: str):
        self.model = model
        self.retrospect_date = retrospect_date
        self.before_date = before_date
        self.agent = Agent(
            name=f"Planner Agent",
            model_settings=ModelSettings(temperature=0.2),
            model=model,
            instructions=DISCOVERER_PLANNER_INST,
            output_type=self.OUTPUT_MODEL
        )


    async def _async_run(self, questions, features: list, verbose: bool = False):
        async def run_question(question):
            question_text = question["question"]
            res = await Runner.run(deepcopy(self.agent), input=f"Question text: {question_text}")
            res_dict = res.final_output.model_dump()
            if verbose:
                print(res_dict.get("hooks"))
            return res_dict

        # Build tasks for all questions
        tasks = [run_question(question) for question in questions]

        # Run them concurrently
        results = await asyncio.gather(*tasks, return_exceptions=False)

        # The results is already grouped by questions for next step use
        extracted_results = [res.get("hooks", {}) for res in results]

        # filter out not computatble results
        filtered_results = [
            entry 
            for entry in extracted_results if entry.get('is_computable') == True
        ]
        return filtered_results

    def run(self, questions, features, verbose: bool = False):
        return asyncio.run(self._async_run(questions, features, verbose))


# TODO Aug 18: don't set this up as a function call, but as a subsequent step (its the same and more robust)

@function_tool
def tool_data_fact_discoverer(wrapper: RunContextWrapper[List], question_text: str, feature_name: str, attribute_type: str) -> str:
    """
    Data Fact Discoverer Tool

    This tool is the primary way to obtain evidence (data facts) from patient data. 
    It should be called whenever the Planner determines that a question is computable 
    and requires factual evidence. In particular, this tool can discover how a specific 
    feature changes over time (trend analysis).

    Args:
        question_text (str): The clinician's question to be answered.
        feature_name (str): The feature to analyze in order to discover data facts.
        attribute_type (str): The type of attribute to analyze (e.g., trend, value).

    Returns:
        FactTrendConfig: Structured data facts discovered about the specified feature.
    """
    context = wrapper.context
    feature_input_raw_data = search_feature_in_feature_list(
        context["features"], feature_name
    )
    print(feature_input_raw_data)

    print(attribute_type)
    trend_agent = TrendDiscovererAgent(
        question_text,
        context['retrospect_date'],
        context['before_date'],
        "gpt-4.1"
    )
    result = asyncio.run(trend_agent.run(feature_input_raw_data["data"]))
    return result
