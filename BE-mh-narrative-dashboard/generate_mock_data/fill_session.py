import asyncio
import json
import os
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
from synthesizer.synthesizer import Synthesizer

def load_json(path):
    with open(path, 'r') as f:
        return json.load(f)

def format_history_encounters(encounter_hist):
    return "\n".join([f"{encounter['date']} - {encounter['type']} - {encounter['medical_condition']}" for encounter in encounter_hist])

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
                f"{feature_data_facts['modality_source']} - {feature_data_facts['feature_name']} : {fact['fact_description']}" for fact in feature_data_facts['data_facts']])
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
        
        # summarization_agent = Agent(
        #     name = "summarization",
        #     instructions = "You are an health expert. Summarize the patient's medical history into a 100 word pragraph. Output only the summary text without anything else.",
        #     model_settings=ModelSettings(
        #         temperature=0.2,
        #         top_p=0.1),
        #     model=MODEL_NAME,
        # )
        # encounter_summary = asyncio.run(Runner.run(summarization_agent, input = all_history_encounter_str))
        # encounter_summary = encounter_summary.final_output

        all_history_medication_str = format_history_medications(persona['medication'])

        # Step 2: talk to patient
        past_session_transcripts = []
        past_session_medications = []
        past_session_notes = []
        for mh_encounter in mock_mh_encounters:
            # only generate encounter 2, 3 transcripts; encounter 4 is not happening yet (test case)
            if mh_encounter['encounter_id'] >= 4:
                break
            
            # Read the first transcript in
            if mh_encounter['encounter_id'] == 1:
                # read seed transcript
                # Step 0: Inject first encounter transcript as background
                patient_name_key = persona['name'].split(" ")[0]
                # find the file in ./generate_mock_data/online_materials that contains the name_key
                for file in os.listdir('./generate_mock_data/online_materials'):
                    if patient_name_key in file and file.endswith('.json'):
                        with open(f'./generate_mock_data/online_materials/{file}', 'r') as f:
                            transcript = json.load(f)

                # assert transcript is not none
                assert transcript is not None and transcript != {}
                combined_transcript = transcript
            else:
                data_insights_str = "Data insights:\n" + "\n".join(mh_encounter['data_insights'])
                print(data_insights_str)
                                
                persona_description = []
                for key, value in persona.items():
                    if key != 'medication' and key != 'encounters':
                        persona_description.append(f"{key}: {value}")
                persona_description = "\n".join(persona_description)

                combined_transcript = asyncio.run(
                    simulate_session(
                        patient_id=person_id, 
                        context_persona=persona_description,
                        context_medical=all_history_encounter_str + all_history_medication_str,
                        context_transcript=f"{past_session_transcripts}",
                        context_medications=f"{past_session_medications}",
                        context_medical_notes=f"{past_session_notes}",
                        context_data_insights=data_insights_str,
                        encounter_count=mh_encounter['encounter_id'],
                        verbose=True))

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

            combined_transcript_dict = {
                "date": mh_encounter['before_date'],
                "transcript": combined_transcript
            }

            past_session_transcripts.append(combined_transcript_dict)
            past_session_medications.extend(medications)
            past_session_notes.append(clinical_note)

            with open(f'./generate_mock_data/context/{person_id}_full.json', 'w') as f:
                # save temp using json
                json.dump(mock_mh_encounters, f, indent=2)
                # f.write('\n')
        break