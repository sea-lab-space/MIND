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
    DiscovererQAOutput,
)
from discoverer import (
    TrendDiscovererAgent
)
from kb.defs import NUMERICAL_FEATURE_KB
from utils.search import search_feature_in_feature_list


TrendAgentDummy = TrendDiscovererAgent(
    "", "2025-08-16", "2025-08-17", "gpt-4.1"
)

TREND_AGENT_NAME = TrendAgentDummy.agent.name

ALL_FEATURE_DESCRIPTION = "\n".join(
    f"{feature['rename']}: {feature['description']}" for _, features in NUMERICAL_FEATURE_KB.items() for _, feature in features.items()
)


# {OPENAI_AGENTIC_PLANNING}
DISCOVERER_PLANNER_INST = f"""
{OPENAI_AGENTIC_REC}
{OPENAI_AGENTIC_TOOL_USE}


{get_mh_data_expert_system_prompt()}

You will be given a question that a clinician want to know before the start of the mental health session.
The patient has provided multiple data modalities. In triplebacktics below, you are given all the features and definitions
```
{ALL_FEATURE_DESCRIPTION}
```
You must always follow these steps carefully:

1. Determine whether the question is computable using the available data.  
   - If there is truly no evidence, return "None".  
   - Do NOT attempt to answer speculatively without evidence.  

2. If the question is computable, you MUST plan the steps to answer it:  
   - Decide what type of data fact is needed to provide evidence.  
   - Identify which feature(s) from the knowledge base are relevant.  
   - Use the Data Fact Discoverer tool to obtain the evidence. Never invent data facts yourself — always call the tool.
     - When you call the tool, you should provide three parameters:
       - The question text.
       - The feature name.
       - The attribute type (trend, value, etc.).
   - After retrieving results, organize the data facts into the required output format.  

Important:  
- Treat the Data Fact Discoverer tool as the **only valid way** to obtain evidence.  
- You should always hand off to the tool when the question involves trends, values, or other measurable properties.  
- Your role is to plan, delegate to the tool, and then structure the results — not to fabricate facts.  
"""

class PlannerAgent:

    OUTPUT_MODEL = DiscovererQAOutput

    def __init__(self, retrospect_date: str, before_date: str, model: str):
        self.model = model
        self.retrospect_date = retrospect_date
        self.before_date = before_date
        self.agent = Agent(
            name=f"Planner Agent",
            model_settings=ModelSettings(temperature=0.2),
            model=model,
            instructions=DISCOVERER_PLANNER_INST,
            output_type=self.OUTPUT_MODEL,
            tools=[
                tool_data_fact_discoverer
            ],
        )

    async def _async_run(self, questions, features: list, verbose: bool = False):
        for question in questions:
            question_text = question["question"]

            res = await Runner.run(self.agent, input=f"Question text: {question_text}", max_turns=1000000,
                                   context={
                                       "features": features,
                                       "retrospect_date": self.retrospect_date,
                                       "before_date": self.before_date,
                                       })
            res_dict = res.final_output.model_dump()
            if verbose:
                print(res_dict.get("facts"))

        # if verbose:
        #     print(formatted_text)
        # res = await Runner.run(self.agent, formatted_text)
        # res_dict = res.final_output.model_dump()
        # if verbose:
        #     print(res_dict.get("facts"))
        # return res_dict.get("facts") or res_dict

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
