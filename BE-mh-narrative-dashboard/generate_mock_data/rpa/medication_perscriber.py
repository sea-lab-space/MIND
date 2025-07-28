from agents import Agent, ModelSettings, Runner
from generate_mock_data.prep_fill_EHR_history import MedicationResponse

async def prescribe_medication(transcript: str, model_name: str) -> MedicationResponse:
    medication_prescriber_agent = Agent(
        name="medication_prescriber_agent",
        instructions=f"""
            You are a knowledgeable mental health expert with expertise in depression.
            Your task is to prescribe medication to a patient who just had a conversation with you.
            Determine if the patient needs medication based on the conversation, and output the medications in the given format.
        """,
        model_settings=ModelSettings(temperature=0.5, top_p=0.5),
        model=model_name,
        output_type=MedicationResponse
    )

    res = await Runner.run(medication_prescriber_agent, input=f"""
        Transcription:
        {transcript}
    """)

    medication_dict = res.final_output.model_dump()

    if medication_dict is None:
        return []
    return medication_dict['response']
