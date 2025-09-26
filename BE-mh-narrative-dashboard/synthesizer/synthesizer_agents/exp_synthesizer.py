import asyncio
from pydantic import BaseModel, Field
from agents import Agent, ModelSettings, Runner
from typing import List, Literal
from datetime import datetime
import sys
from pathlib import Path
from dotenv import load_dotenv
from synthesizer.synthesizer_commons import SYNT_CATEGORIZATION_PROMPT, SYNT_CATEGORY_PROMPT, SYNT_DATA_PROMPT, SYNT_EXAMPLES, SYNT_RULES
from utils.prompt_commons import OPENAI_AGENTIC_REC, OPENAI_AGENTIC_TOOL_USE, OPENAI_AGENTIC_PLANNING, get_mh_data_expert_system_prompt
from utils.tools import retrive_data_facts

project_root = Path(__file__).parent.parent.parent
print(project_root)
sys.path.append(str(project_root))
load_dotenv()

from MIND_types import (
    InsightProposalOutputModel
)

SYNT_TASK_PROMPT = """
Your task is to extract data-driven insights that are clinically relevant to a mental health clinician.
"""

class ExploratorySynthesizerAgnet:
    OUTPUT_MODEL = InsightProposalOutputModel

    def __init__(self, data_fact_list, model: str):
        self.data_fact_list = data_fact_list
        self.agent = Agent(
            name=f"Insight proposal agent",
            model_settings=ModelSettings(temperature=0.2, top_p=0.1),
            model=model,
            output_type=self.OUTPUT_MODEL,
        )

    def _glue_instructions(self):
        return f"""
            {OPENAI_AGENTIC_REC}

            {get_mh_data_expert_system_prompt()}
            {SYNT_DATA_PROMPT}

            {SYNT_TASK_PROMPT}
            {SYNT_CATEGORIZATION_PROMPT}
            {SYNT_RULES}
            
            Generate as much data insight as possible (at least 15).
            If provided, incorporate feedbacks of your previous versions. Improve exsisting work, and add new insights.
            Let's think step by step.
        """

    async def _run_async(self, data_facts, verbose: bool = False):
        self.agent.instructions = self._glue_instructions()
        if verbose:
            print(data_facts)

        res = await Runner.run(self.agent, data_facts)

        res_dict = res.final_output.model_dump()
        if verbose:
            print(res_dict.get("insights"))
        return res_dict.get("insights") or res_dict
    
    def run(self, data_facts, verbose: bool = False):
        return asyncio.run(self._run_async(data_facts, verbose))