

import os
import sys
import asyncio
import json
from pathlib import Path
from dotenv import load_dotenv
import openai

project_root = Path(__file__).parent.parent
print(project_root)
sys.path.append(str(project_root))
load_dotenv()

from typing import List, Literal
from pydantic import BaseModel, Field


class Encounter(BaseModel):
    date: str = Field(...,
                      description="The date of the encounter, in YYYY-MM-DD format.")
    type: Literal['Hospital Encounter', 'Office Visit'] = Field(
        ..., description="The type of encounter.")
    medical_condition: str = Field(..., description="The medical condition being treated.")
    ICD_10_CM: str = Field(..., description="The ICD-10-CM code for the medical condition.")
    CPT_code: str = Field(..., description="The CPT code for the encounter.")
    notes: str = Field(..., description="Progress note about the encounter.")

class EncounterResponse(BaseModel):
    response: List[Encounter]

# why 400 - 600 words? https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2782054
ENCOUNTER_PROMPT = """
You are a knowledgeable medical expert with expertise in EHR data.
You have previously read a lot of EHR data and have a good understanding of the medical conditions and treatments that are commonly seen in EHR data.

You are given a depression patient's persona.
Your task is to generate at least 15 past encounters of the patient. 

Requirements:
1) The encounters should be in chronological order. 
2) The encounters should include the date, type of encounter, medical condition, ICD-10-CM code, CPT code, and progress note.
3) The encounters should be generated based on the patient's persona.
4) The encounters do not have to be mental health-related: it could be any medical condition that the patient has.
5) Make sure at least 5 encounters are mental health disorder-related, but they do not need to be depression.
6) All encounters should be before 2021-03-28.
7) The progress note should be around 400 - 600 words.
"""

class Medication(BaseModel):
    date: str = Field(..., description="The date when the medication was prescribed, in YYYY-MM-DD format.")
    medication: str = Field(..., description="The name of the medication.")
    dosage: str = Field(..., description="The dosage of the medication.")
    frequency: str = Field(..., description="The frequency of the medication.")

class MedicationResponse(BaseModel):
    response: List[Medication]

MEDICATION_PROMPT = f"""
You are a knowledgeable medical expert with expertise in EHR data.
You have previously read a lot of EHR data and have a good understanding of the medications that are commonly prescribed in EHR data.

You are given a depression patient's persona and the previous encounters.
Your task is to generate the medications the clinician prescribed to the patient.

Requirements:
1) The medications should be in chronological order.
2) The medications should include the date when the medication was prescribed, the name of the medication, the dosage, and the frequency.
3) The medications should align with the previous encounters.
4) It is possible that the patient has not been prescribed any medication.
5) It is also possible that the patient was prescribed multiple medications on the same day. In this condition, create multiple entries for the same date.
6) Make sure that at least 3 prescribed medication was made.
"""


if __name__ == '__main__':
    openai.api_key = os.getenv("OPENAI_API_KEY")
    client = openai.OpenAI()
    MODEL_NAME = "gpt-4.1"

    with open('./generate_mock_data/personas_stub.json', 'r') as f:
        data = json.load(f)
    for patient, persona in data.items():
        # Step 1: Generate encounter (clinical events) from persona
        # print(persona)
        encounter_prompt = f'''
            {ENCOUNTER_PROMPT}

            Below are the patient persona in JSON:
            {persona}
        '''
        response = client.responses.parse(
            model=MODEL_NAME,
            input=[
                {"role": "system", "content": encounter_prompt}
            ],
            text_format=EncounterResponse,
            temperature=0
        )
        event = response.output_parsed
        # pydantic to dict
        event_dict = event.model_dump()
        encounters = event_dict['response']
        
        # Step 2: Generate medication from encounter
        medication_prompt = f'''
            {MEDICATION_PROMPT}

            Below are the patient persona in JSON:
            {persona}

            Below are the previous encounters of the patient:
            {encounters}
        '''
        
        response = client.responses.parse(
            model=MODEL_NAME,
            input=[
                {"role": "system", "content": medication_prompt}
            ],
            text_format=MedicationResponse,
            temperature=0
        )
        medication = response.output_parsed
        # pydantic to dict
        medication_dict = medication.model_dump()
        medications = medication_dict['response']
        
        # Step 3: Add to the patient file
        data[patient]['medication'] = medications
        data[patient]['encounters'] = encounters
    
    with open('./generate_mock_data/personas_full.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)