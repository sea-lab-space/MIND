import asyncio
from copy import deepcopy
from typing import Literal
from agents import Agent, ModelSettings, Runner
from pydantic import BaseModel, Field
from utils.datetime_checker import date_before, date_between
from utils.prompt_commons import get_mh_data_expert_system_prompt


GENERAL_SUMMARIZATION_SYSTEM = """
You are an health expert.
"""

def get_health_system_prompt(length: Literal['minimal', 'short']):
    if length == 'minimal':
        return f"""
        {GENERAL_SUMMARIZATION_SYSTEM} Summarize the patient's medical history into a minimal, comma-connected narrative within 15 words.
        """
    elif length == 'short':
        return f"""
        {GENERAL_SUMMARIZATION_SYSTEM} Summarize the patient's medical history into a short, less than 30-word description.
        """
    else:
        raise ValueError("Invalid length")

MENTAL_HEALTH_SYSTEM = f"""
{get_mh_data_expert_system_prompt()}
"""

def get_mh_system_prompt(length: Literal['minimal', 'short']):
    if length == 'minimal':
        return f"""
        {MENTAL_HEALTH_SYSTEM} Summarize the patient's previous session highlights and major concerns into a minimal, comma-connected narrative within 15 words.
        """
    elif length == 'short':
        return f"""
        {MENTAL_HEALTH_SYSTEM} Summarize the patient's previous session highlights and major concerns into a short, less than 30-word description.
    """
    else:
        raise ValueError("Invalid length")

class SummarizationFacets(BaseModel):
    # medical_history: str = Field(..., description="The patient's medical history")
    sessions_recap: str = Field(..., description="The patient's sessions recap")
    current_concerns: str = Field(..., description="The patient's current concerns")
    # medication: str = Field(..., description="The patient's medication")

class SummarizationAgent:
    def __init__(self, data, retrospect_date, before_date, model_name):
        self.data = data
        self.retrospect_date = retrospect_date
        self.before_date = before_date
        self.general_agent = Agent(
            name="summarization general",
            model_settings=ModelSettings(
                temperature=0.2,
                top_p=0.1
            ),
            model=model_name,
        )

        self.mental_health_agent = Agent(
            name="summarization mental health",
            model_settings=ModelSettings(
                temperature=0.2,
                top_p=0.1
            ),
            model=model_name,
            output_type=SummarizationFacets
        )

    def _run_general(self, previous_ehr):
        versions = ['minimal', 'short']
        tasks = []

        for version in versions:
            agent_copy = deepcopy(self.general_agent)
            agent_copy.instructions = get_health_system_prompt(version)
            tasks.append(self._run_agent(agent_copy, version, previous_ehr))

        results = asyncio.run(self._gather_results(tasks))
        return results
    
    def _run_mental_health(self, previous_session):
        versions = ['minimal', 'short']
        tasks = []

        for version in versions:
            agent_copy = deepcopy(self.mental_health_agent)
            agent_copy.instructions = get_mh_system_prompt(version)
            tasks.append(self._run_agent(agent_copy, version, previous_session))

        results = asyncio.run(self._gather_results(tasks))
        return results

    async def _run_agent(self, agent, version, data):
        result = await Runner.run(agent, input = data)
        return {
            "version": version,
            "result": result.final_output
        }

    async def _gather_results(self, tasks):
        return await asyncio.gather(*tasks)
    
    def run(self):
        previous_encounter = self.data['encounter_history_before']
        previous_med = self.data['medical_history_before']
        previous_ehr = f"""
            Previous Encounter: 
            {previous_encounter}

            Previous Medication: 
            {previous_med}
        """

        general_results = self._run_general(previous_ehr)

        encounter_history = '\n'.join([
            f"{encounter['encounter_date']}: {encounter['clinical_note']}" 
            for encounter in self.data['this_series'] 
            if date_before(encounter['encounter_date'], self.before_date)
        ])


        medication_history = set()

        for med in self.data['this_series']:
            if date_before(med['encounter_date'], self.before_date):
                med_info = med.get('medication', {})
                for med in medication_history:
                    medication_history.add(med.get('medication', ''))
        medication_history = list(medication_history)


        mh_results = self._run_mental_health(encounter_history)

        # print(general_results, mh_results)
        summary_dict = {}
        for general in general_results:
            if general['version'] == 'minimal':
                summary_dict['folded'] = general['result']
            else:
                summary_dict['expanded'] = general['result']

        recap_dict = {}
        concerns_dict = {}
        for mh in mh_results:
            if mh['version'] == 'minimal':
                recap_dict['folded'] = mh['result'].sessions_recap
                concerns_dict['folded'] = mh['result'].current_concerns
            else:
                recap_dict['expanded'] = mh['result'].sessions_recap
                concerns_dict['expanded'] = mh['result'].current_concerns

        if len(medication_history) > 0:
            medication_note = ", ".join(medication_history)
        else:
            medication_note = "No medication history with current sessions."
                
        return {
            "basicInfoCard": {
                "name": self.data['name'],
                **self.data['demographics']
            },
            "infoCards": [
                {
                    "icon": "history",
                    "overviewHeadTitle": "Medical History",
                    "cardContent": summary_dict
                },
                {
                    "icon": "history",
                    "overviewHeadTitle": "Sessions Recap",
                    "cardContent": recap_dict
                },
                {
                    "icon": "brain",
                    "overviewHeadTitle": "Current Concerns",
                    "cardContent": concerns_dict
                },
                {
                    "icon": "medication",
                    "overviewHeadTitle": "Medication and Treatment",
                    "cardContent": {
                        "folded": medication_note,
                        "expanded": medication_note
                    }
                }
            ]
        }
