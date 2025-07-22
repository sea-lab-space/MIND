import asyncio
import json
from agents import Agent, ModelSettings, Runner, SQLiteSession
from dotenv import load_dotenv
from pydantic import BaseModel, Field, TypeAdapter
from pathlib import Path
import sys

project_root = Path(__file__).parent.parent
sys.path.append(str(project_root))
load_dotenv()

from generate_mock_data.rpa.interview_role_play import simulate_session
from generate_mock_data.rpa.note_writer import write_progress_note
from generate_mock_data.rpa.medication_perscriber import prescribe_medication

def load_json(path):
    with open(path, 'r') as f:
        return json.load(f)

def format_history_encounters(encounter_hist):
    return "\n".join([f"{encounter['date']} - {encounter['type']} - {encounter['medical_condition']}: {encounter['notes']}" for encounter in encounter_hist])

def format_history_medications(medication_hist):
    return "\n".join([f"{medication['date']} - {medication['medication']} - {medication['dosage']} - {medication['frequency']}" for medication in medication_hist])

def synthesize_data_facts(data_facts):
    if len(data_facts) == 0:
        return ""
    else:
        texts = []
        for feature_data_facts in data_facts:
            # print(feature_data_facts)
            if feature_data_facts['modality_type'] == "survey":
                text = "\n".join([
                    f"{feature_data_facts['modality_source']} - {feature_data_facts['feature_name']} - {fact['fact_type']} : {fact['fact_description']}" for fact in feature_data_facts['data_facts']])
                texts.append(text)
        return "\n\n".join(texts)

if __name__ == "__main__":
    MODEL_NAME = 'gpt-4.1'
    personas = load_json('./generate_mock_data/context/personas_full.json')
    for person_id, persona in personas.items():
        # open person encounter history
        mock_mh_encounters = load_json(f'./generate_mock_data/context/encounters_mock_{person_id}.json')
        # print(encounter_hist)

        """
        # Each time, consider history notes (1st time past encounter notes summary), passive sensing / measurement scores (data facts summary), medication and encounter
        # Pass through four steps:
            1) see history
            2) talk to patient
            3) perscribe medicine and log encounter
            4) write medical note
        """

        # Step 1: see all history (excluding this mh session series)
        all_history_encounter_str = format_history_encounters(persona['encounters'])
        
        # TODO: summarize all history into 50 words
        summarization_agent = Agent(
            name = "summarization",
            instructions = "You are an health expert. Summarize the patient's medical history into a 100 word pragraph. Output only the summary text without anything else.",
            model_settings=ModelSettings(temperature=0.0),
            model=MODEL_NAME,
        )
        encounter_summary = asyncio.run(Runner.run(summarization_agent, input = all_history_encounter_str))
        encounter_summary = encounter_summary.final_output

        all_history_medication_str = format_history_medications(persona['medication'])

        # Step 2: talk to patient
        past_session_notes = []
        for mh_encounter in mock_mh_encounters:
            # Input 1: passive sensing / measurement scores data facts
            data_facts_str = synthesize_data_facts(mh_encounter['data_facts'])
            # print(data_facts_str)
            
            # Input 2: last encounters notes
            if mh_encounter['encounter_id'] != 1:
                mh_history_notes = "\n\n".join([past_session_notes[i] for i in range(0, mh_encounter['encounter_id'] - 1)])
            else:
                mh_history_notes = ""
            # Modality 3: patient persona
            persona_description = []
            for key, value in persona.items():
                if key != 'medication' and key != 'encounters':
                    persona_description.append(f"{key}: {value}")
            persona_description = "\n".join(persona_description)

            context = f"""
                ## Patient Info
                ### Persona
                {persona_description}

                ### Past encounters
                {encounter_summary}

                ### Past medications
                {all_history_medication_str}

                ### Session notes with the current clinician
                {mh_history_notes}

                ### Data-driven evidences
                {data_facts_str}
            """

            print(context)

            combined_transcript = asyncio.run(simulate_session(person_id, context, mh_encounter['encounter_id'], verbose=True))
            
            # read combined_transcript
            # with open(f'./generate_mock_data/{person_id}_combined_transcript.json', 'r') as f:
            #     combined_transcript = json.load(f)

            # print(combined_transcript)

            # Step 3: perscribe medicine and log encounter
            medications = asyncio.run(prescribe_medication(combined_transcript, MODEL_NAME))
            if len(medications) != 0:
                # fix date to be the same as the encounter
                for medication in medications:
                    medication["date"] = mh_encounter['before_date']
            
            print(medications)

            clinical_note = asyncio.run(write_progress_note(combined_transcript, medications, MODEL_NAME))
            print(clinical_note)

            mh_encounter['transcript'] = combined_transcript
            mh_encounter['medication'] = medications
            mh_encounter['clinical_note'] = clinical_note

            combined_transcript_str = "\n".join([f"Clinician: {turn['clinician']}\nPatient: {turn['patient']}" for turn in combined_transcript])

            past_session_notes.append(combined_transcript_str)
            # print(combined_transcript_str)

            # temp = {
            #     "medication": medications,
            #     "clinical_note": clinical_note
            # }
            with open(f'./generate_mock_data/context/{person_id}_full.json', 'w') as f:
                # save temp using json
                json.dump(mock_mh_encounters, f, indent=2)
                # f.write('\n')
        break