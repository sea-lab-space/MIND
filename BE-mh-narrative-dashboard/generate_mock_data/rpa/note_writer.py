import asyncio
from agents import Agent, ModelSettings, Runner

async def write_progress_note(transcript, medication, model_name):
    note_writing_agent = Agent(
        name="note_writer",
        instructions=f"""
            You are an expert in writing progress notes for EHR. You are given a transcript of a conversation between a patient and a clinician. 
            
            Your task is to write a progress note based on the transcript and the perscribed medication. The progress note should be in a format that is easy to read and understand. 
            
            The progress note should be written in the SOAP (Subjective, Objective, Assessment, and Plan) note format, with a length for about 400 - 600 words. Ensure consistency between the transcript, medication, and notes.

            Template for medical note:
            **Subjective**: |note content|
            **Objective**: |note content|
            **Assessment**: |note content|
            **Plan**: |note content|
        """,
        model_settings=ModelSettings(temperature=0.2, top_p=0.1),
        model=model_name
    )

    res = await Runner.run(note_writing_agent, input = f"""
        Transcription:
        {transcript}

        Medication perscription:
        {medication}
    """)
    return res.final_output


async def mock_progress_note(encounters, persona, model_name):
    mock_note_agent = Agent(
        name="mock_note_writer",
        instructions=f"""
            You are an expert in writing progress notes for EHR. You are given a clinical encounter.
            Use your imagination on what happened during the encounter and write a progress note based on the encounter.
            Align the progress note with the persona, and prevent factual issues (e.g., not aligning to the name, age etc.)
            The progress note should be written in the SOAP (Subjective, Objective, Assessment, and Plan) note format, with a length for about 400 - 600 words.

            Template for medical note:
            **Subjective**: |note content|
            **Objective**: |note content|
            **Assessment**: |note content|
            **Plan**: |note content|
            """,
        model_settings=ModelSettings(temperature=0.5, top_p=0.5),
        model=model_name
    )

    tasks = [Runner.run(mock_note_agent, input = f"Persona: {persona}\nEncounter: {encounter}") for encounter in encounters]
    res = await asyncio.gather(*tasks)
    
    return [r.final_output for r in res]