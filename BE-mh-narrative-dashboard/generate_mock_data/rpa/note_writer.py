from agents import Agent, ModelSettings, Runner

async def write_progress_note(transcript, medication, model_name):
    note_writing_agent = Agent(
        name="note_writer",
        instructions=f"""
            You are an expert in writing progress notes for EHR. You are given a transcript of a conversation between a patient and a clinician. 
            Your task is to write a progress note based on the transcript and the perscribed medication. The progress note should be in a format that is easy to read and understand. 
            The progress note should be around 400 - 600 words. Ensure consistency between the transcript, medication, and notes.
        """,
        model_settings=ModelSettings(temperature=0.0),
        model=model_name
    )

    res = await Runner.run(note_writing_agent, input = f"""
        Transcription:
        {transcript}

        Medication perscription:
        {medication}
    """)
    return res.final_output