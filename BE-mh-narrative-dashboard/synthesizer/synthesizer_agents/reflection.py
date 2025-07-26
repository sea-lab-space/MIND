from pydantic import BaseModel, Field
from agents import Agent, ModelSettings, Runner
from typing import List, Literal
from datetime import datetime
import sys
import asyncio
import json
from pathlib import Path
from dotenv import load_dotenv
from synthesizer.synthesizer_agents.actor import SYNT_TASK_PROMPT
from utils.prompt_commons import OPENAI_AGENTIC_REC, OPENAI_AGENTIC_TOOL_USE, OPENAI_AGENTIC_PLANNING, get_mh_data_expert_system_prompt
from utils.tools import retrive_data_facts

project_root = Path(__file__).parent.parent.parent
print(project_root)
sys.path.append(str(project_root))
load_dotenv()


SYNT_CRITIQIUE_DATA_PROMPT = f"""
You are provided with a list of data insights generated in the following format:
{{
    "insight_description": str,
    "insight_source": List[str],
    "insight_category": List[str],
    "entropy": float
}}
Where:
- `insight_description` is a textual description of the insight.
- `insight_source` is a list of data fact IDs that support the insight, each in the format: `[modality]-[source]-[id]`.  
  - `[modality]` can be:
    - `sv` (survey)
    - `ps` (passive sensing)
    - `text` (clinical notes or session transcript)
  - Data type could be one of survey, passive sensing, clinical notes, or session transcript.
- `insight_category` is a list of categories the insight belongs to.
- `entropy` represents the diversity of information sources supporting the insight.
"""

SYNT_CATEGORY_PROMPT = f"""
You should consider the generated insight based on the following |category/categories|:
* Sleep Patterns
* Physical Activity
* Digital Engagement
* Emotional State
* Social Interaction
* Medication & Treatment
"""


SYNT_CRITIQUE_PROMPT = """
You are provided with your previously |generated insights| derived from a corpus of data facts, along with the following feedback:
* The |entropy| of each individual insight (indicating the diversity of its information sources)
* The |overall entropy| across all insights
* The |coverage| of data facts used in generating your insights
* Your own |self-reflection history| on those insights

Your task is to critically evaluate the |generated insights| using both the external feedback (entropy and coverage) and your internal reflection.
Consider the following facets:
* Are your insights too narrow or too broad?
* Are they supported by a diverse and balanced set of data sources (that increases |entropy|)?
* Is there redundancy or overlooked information (that increases |coverage|)?
* How well do your insights covers all the |category/categories| of insights clinicians expect?

Based on this reflection, propose improvements to your original insights.
Specifically, propose what kind of new data facts you would include to improve your insights, and what kind of new |category/categories| of insights you would like to generate.
However, do not over optimize: different data types should be represented in a balanced way.

Let's think step by step.
"""

def get_reflection_prompt(insights, overall_entropy, coverage, reflection_history):
    return f"""
        |generated insights|:
        {insights}
        |overall entropy|: {overall_entropy}
        |coverage|: {coverage}

        |self-reflection history|: {reflection_history}
    """


class InsightReflectionOutputModel(BaseModel):
    reflection: str

class InsightReflectionAgent:
    def __init__(self, model: str):
        self.agent = Agent(
            name=f"Insight reflection agent",
            model_settings=ModelSettings(temperature=0.2, top_p=0.1),
            model=model,
            output_type=InsightReflectionOutputModel,
        )

    def _glue_instructions(self):
        return f"""
            {OPENAI_AGENTIC_REC}
            {get_mh_data_expert_system_prompt()}
            {SYNT_CRITIQUE_PROMPT}
            {SYNT_CATEGORY_PROMPT}
            {SYNT_CRITIQIUE_DATA_PROMPT}
            {SYNT_TASK_PROMPT}
        """

    async def run(self, data_insights, entropy, coverage, history, verbose: bool = False):
        self.agent.instructions = self._glue_instructions()
        

        res = await Runner.run(self.agent, get_reflection_prompt(
            data_insights,
            entropy,
            coverage,
            history
        ))

        res_dict = res.final_output.model_dump()
        if verbose:
            print(res_dict.get("reflection"))
        return res_dict.get("reflection") or ""
