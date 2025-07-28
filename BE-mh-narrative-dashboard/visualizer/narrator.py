from pydantic import BaseModel, Field
from agents import Agent, ModelSettings, Runner
from typing import List, Literal
from datetime import datetime
import sys
from pathlib import Path
from dotenv import load_dotenv
from synthesizer import (
    CATEGORIES
)
from utils.prompt_commons import OPENAI_AGENTIC_REC, OPENAI_AGENTIC_TOOL_USE, OPENAI_AGENTIC_PLANNING, get_mh_data_expert_system_prompt
from utils.tools import retrive_data_facts

project_root = Path(__file__).parent.parent.parent
print(project_root)
sys.path.append(str(project_root))
load_dotenv()


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
- Select 8 to 12 of the most important insights.
- Sequence them to form a logically connected and clinically meaningful narrative.
- Focus on insights that highlight key patterns, changes, or concerns in the patient’s condition.
- Think step by step to ensure coverage, salience, and narrative coherence.

Output Format (Strict):
Return a list of selected insight_id values, in the order they should appear in the final narrative.

Let's think step by step:
1. Skim all insights.
2. Group and prioritize insights based on clinical impact and interconnection.
3. Select 8 – 12 that best reflect the patient’s current condition and story.
4. Order them to build a clear and logical progression.
5. Return only the list of IDs, in final narrative order.
"""

class InsightVisualierOutputModel(BaseModel):
    insights: List[str]

class NarratorAgent:
    OUTPUT_MODEL = InsightVisualierOutputModel

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
            data_insights[i]["insight_id"] = f"ins-{i}"
        
        prompt_str = "\n".join(
            f"<{insight['insight_id']}>: {insight['insight_description']} [{', '.join(insight['insight_category'])}]"
            for i, insight in enumerate(data_insights)
        )

        return prompt_str, data_insights

    async def run(self, data_insights: dict, verbose: bool = False):
        self.agent.instructions = self._glue_instructions()
        if verbose:
            print(data_insights)
        
        prompt_input, data_insights_ided = self._glue_data_insights(data_insights)

        res = await Runner.run(self.agent, prompt_input)
        res_dict = res.final_output.model_dump()
        data_insights_list = res_dict.get("insights")
        
        # find the original insights based on the ids
        sequenced_data_insights = []
        for insight_id in data_insights_list:
            for insight in data_insights_ided:
                if insight["insight_id"] == insight_id:
                    sequenced_data_insights.append(insight)
                    break
        if verbose:
            print(sequenced_data_insights)
        return sequenced_data_insights
