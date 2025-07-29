import openai

from MIND_types import (
    TranscriptResponse
)


def simulate_session_simple(
    patient_id: str,
    context_persona: str,
    context_medical: str,
    context_transcript: str,
    context_data_insights: str,
    context_medications: str,
    context_medical_notes: str,
    encounter_count: int = 1, model_name: str = "gpt-4.1", verbose=True):

    client = openai.OpenAI()

    simulation_instructions = f'''
        You are a helpful assistant. Strictly follow users' instructions and generate outputs.
    '''

    encounter_prompt = f'''
        Your task is to role-play a conversation between a depression patient and a mental health clinician.
        
        You will be given the following information:
        - patient persona
        - patient medical history
        - insights of patient data
        - current medications
        - previous session transcripts

        patient persona:
        {context_persona}

        patient medical history:
        {context_medical}

        insights of patient data:
        {context_data_insights}

        current medications:
        {context_medications}

        previous session transcripts:
        {context_transcript}

        You should use the above information to ground the generation of the new session.
        This is the patient's {encounter_count} session. Build on previous sessions. The generated session should have at least 35 rounds of conversation.
    '''
    
    response = client.responses.parse(
        model=model_name,
        instructions=f"""{simulation_instructions}""",
        input=[
            {"role": "system", "content": encounter_prompt}
        ],
        text_format=TranscriptResponse,
        temperature=1
    )
    event = response.output_parsed
    # pydantic to dict
    event_dict = event.model_dump()
    transcript = event_dict['response']
    return transcript
