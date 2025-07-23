from pydantic import BaseModel, Field
from agents import Agent, ModelSettings, Runner
from typing import List, Literal
from datetime import datetime
import sys
import asyncio
import json
from pathlib import Path
from dotenv import load_dotenv
from utils.prompt_commons import get_mh_data_expert_system_prompt

project_root = Path(__file__).parent.parent.parent
print(project_root)
sys.path.append(str(project_root))
load_dotenv()






class InsightProposalOutputModel(BaseModel):
    insights: List[TextInsight]


class InsightProposalAgent:
    OUTPUT_MODEL = InsightProposalOutputModel

    def __init__(self, model: str):
        self.model = model
        self.agent = Agent(
            name=f"Insight proposal agent",
            model_settings=ModelSettings(temperature=0.0),
            model=model,
            output_type=self.OUTPUT_MODEL,
        )

    def _glue_instructions(self):
        return f"""
            {get_mh_data_expert_system_prompt()}
            {get_mh_data_expert_modality_prompt(self.modality_source)}
            {get_mh_data_expert_task_prompt()}
            {get_mh_data_expert_requirements_prompt()}
        """

    async def run(self, text_pieces, verbose: bool = False):
        """
        Execute the agent to extract structured facts from the selected clinical texts.

        Args:
            text_pieces (Dict[str, str]): A mapping of date strings to raw text data.
            verbose (bool): If True, prints the formatted text and results for debugging.

        Returns:
            Union[Dict[str, Any], Any]: A dictionary containing extracted factual data, or raw model output if no facts found.
        """
        self.agent.instructions = self._glue_instructions()
        formatted_text = self._glue_text_pieces(text_pieces)
        if verbose:
            print(formatted_text)
        res = await Runner.run(self.agent, formatted_text)
        res_dict = res.final_output.model_dump()
        if verbose:
            print(res_dict.get("facts"))
        return res_dict.get("facts") or res_dict