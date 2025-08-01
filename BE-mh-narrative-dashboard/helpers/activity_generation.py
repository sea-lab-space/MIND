import asyncio
from copy import deepcopy
from typing import Literal
from agents import Agent, ModelSettings, Runner
from pydantic import BaseModel, Field
from utils.datetime_checker import date_before, date_between
from utils.prompt_commons import get_mh_data_expert_system_prompt
from MIND_types import (
    ActivityResponse
)

ACTIVITY_SYSTEM = f"""
{get_mh_data_expert_system_prompt()}

You will be presented with prior medical notes of past encounters. Suggest at least 5 non-clinical activities (e.g., meditation, excerse, etc.) that the patient can do to improve their mental health.
Provide a description of each activity that clinicians can use to introduce to the patients through email/text messages.
"""

class ActivityAgent:
    def __init__(self, model_name):
        self.agent = Agent(
            name="summarization mental health",
            instructions=ACTIVITY_SYSTEM,
            model_settings=ModelSettings(
                temperature=0.2,
                top_p=0.1
            ),
            model=model_name,
            output_type=ActivityResponse
        )

    async def _run(self, clinical_notes):
        res = await Runner.run(self.agent, input = f"""
            Clinical Notes
            {clinical_notes}
        """)
        print(clinical_notes)
        
        res_dict = res.final_output.model_dump()
        print(res_dict)
        return res_dict.get("response") or []
    
    def run(self, clinical_notes):
        return asyncio.run(self._run(clinical_notes))
