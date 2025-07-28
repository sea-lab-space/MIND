import asyncio
import json
from agents import Agent, ModelSettings, Runner, SQLiteSession
from dotenv import load_dotenv
from pathlib import Path
import sys
from utils.prompt_commons import OPENAI_AGENTIC_REC, OPENAI_AGENTIC_TOOL_USE

project_root = Path(__file__).parent.parent
sys.path.append(str(project_root))
load_dotenv()

class EncounterPersona:
    def __init__(self, name, instructions, model_name = 'gpt-4.1-nano'):
        self.name = name
        self.agent = Agent(
            name=self.name,
            instructions=instructions,
            model_settings=ModelSettings(temperature=0.7, top_p=0.8),
            model=model_name
        )
        self.session = SQLiteSession(f"{self.name}")

    async def run(self, input_str):
        result = await Runner.run(self.agent, input=input_str, session=self.session)
        # print(result.final_output)
        return result


    async def return_session(self):
        session_dict = await self.session.get_items()
        return session_dict

    async def dump_session(self, folder):
        session_dict = await self.return_session()
        with open(f'{folder}/{self.name}_session.json', 'w', encoding='utf-8') as f:
            json.dump(session_dict, f, indent=2)


PATIENT_SYSTEM_PROMPT = f"""
{OPENAI_AGENTIC_REC}

You are a patient undergoing therapy for depression. Engage in a realistic, emotionally authentic session with your licensed clinician.

You will be provided with:
- |persona|
- |personal medical history|
- |past session transcripts with this clinician|
- |Highlights of generated data| (e.g., insights of behavior patterns, sensing, survey scores)
- |Current medications|

Your task:
1. Express your mental health challenges naturally, based on your persona and history.
2. Talk like a real patient: thoughtful, hesitant at times, conversational—not scripted.
3. Share one issue at a time (max 5 sentences unless asked). Return to unresolved topics or raise new ones.
4. Refer to past sessions and push back if misunderstood. Don’t always agree or fully understand—ask questions or show resistance if needed.
5. Stay emotionally grounded: be vulnerable, but don’t overshare too quickly. Let trust build gradually.
6. Use a verbal, human style: include filler words, tangents, or confusion where natural.
7. Maintain continuity across turns. Don’t rush. Let the conversation flow organically for at least 50 exchanges.
8. Stay in character. Reflect your mood, thoughts, and experiences consistently.
9. End the session by saying "Goodbye". Do not say "Goodbye" too soon, wait until at least 25 turns have occurred.
10. Mimic past conversation styles of "patient".
"""

CLINICIAN_SYSTEM_PROMPT = f"""
{OPENAI_AGENTIC_REC}
You are a renowned clinician with 20+ years of experience treating depression using evidence-based practices, especially Cognitive Behavioral Therapy (CBT). You’re skilled in data-informed care and know how to analyze and integrate insights from:
- |patient's persona|
- |patient's medical history|
- |past session transcripts with you|
- |Highlights of collected data| (e.g., insights of behavior patterns, sensing, survey scores)
- |Current medications| (you prescribed)
- |your past session notes|

Lead a structured therapy session with the patient across three stages:

**Stage 1: Relationship & Assessment**
- Ask thoughtful, evidence-informed questions based on what the patient says and all data you've reviewed.
- Explore inconsistencies or changes in emotional state, behavior, and functioning.
- Avoid generic empathy or reflective phrases like "restating" or "affirming." Dig into causes with one question at a time.

**Stage 2: Intervention & Insight**
- Help the client reflect on core issues like relationships, thoughts, emotions, coping, and functioning.
- Use CBT techniques to reframe distorted thinking, identify learned behaviors, and build coping strategies.
- Encourage realistic self-awareness and goal articulation (personal, emotional, academic, interpersonal).

**Stage 3: Planning & Closure**
- Guide the patient to summarize gains (e.g., emotional regulation, behavior change, relationship skills).
- Discuss goals and collaboratively create a next-step plan addressing persistent or emerging issues.

**CBT Key Concepts**  
CBT assumes:
- Psychological distress arises from unhelpful thoughts/behaviors.
- People can learn new coping strategies to reduce symptoms.

CBT methods include:
- Identifying and challenging distorted thoughts.
- Problem-solving and behavioral experiments (e.g., role-play, exposure).
- Relaxation and confidence-building strategies.

**Guidelines**
1. Avoid premature empathy or affirmations in Stage 1—use probing, data-informed inquiry instead.
2. Follow the 3-stage structure. Don't skip ahead—pace carefully.
3. Ask one question at a time. Engage the patient step by step.
4. Refer to past transcripts and session notes to guide inquiry and treatment.
5. Ask about or refer to measurement score changes.
6. Sustain at least 50 interactions before closing.
7. End by saying "See you next time" when a treatment plan is established. Do not suggest end of session too soon, wait until at least 25 turns have occurred.
8. Mimic past conversation style of "clinician".
"""


async def simulate_session(
        patient_id: str, 
        context_persona: str, 
        context_medical: str, 
        context_transcript: str, 
        context_data_insights: str, 
        context_medications: str,
        context_medical_notes: str,
        encounter_count: int = 1, model_name: str = "gpt-4.1-nano", verbose = True):
    
    patient_agent = EncounterPersona(
        name=f"{patient_id}_patient",
        instructions=f"""
            {PATIENT_SYSTEM_PROMPT}

            |Persona|
            {context_persona}

            |Personal medical history|
            {context_medical}

            |All past session transcripts with this clinician|
            {context_transcript}

            |Highlights of generated data|
            {context_data_insights}

            |Current medications|
            {context_medications}

            {PATIENT_SYSTEM_PROMPT}
        """,
        model_name=model_name
    )

    clinician_agent = EncounterPersona(
        name=f"{patient_id}_clinician",
        instructions=f"""
            {CLINICIAN_SYSTEM_PROMPT}
        """,
        model_name=model_name
    )

    # clinician start the conversation
    result = await clinician_agent.run(f"""
        Start the session with the patient. This is your {encounter_count} encounter with this patient.
        
        To refresh your memory, this is the patient's condition:
        |patient's persona|
        {context_persona}

        |patient's medical history|
        {context_medical}

        |All past session transcripts with you|
        {context_transcript}

        |Highlights of collected data|
        {context_data_insights}

        |Current medications|
        {context_medications}

        |Past session notes|
        {context_medical_notes}
        
    """)
    last_output = result.final_output
    if verbose:
        print(f"{clinician_agent.name}: {last_output}")
        print("------------------------")

    # alternating speaker
    i = 0
    while True:
        turn_count_str = f"\n\n[Turn count so far: {i // 2 + 1}]"
        speaker = patient_agent if i % 2 == 0 else clinician_agent
        if i > 118:
            result = await speaker.run(last_output + " Please expect to end the conversation in the next round.")
        else:
            result = await speaker.run(last_output + turn_count_str)
            print("------------------------")
        if verbose:
            print(f"{speaker.name}: {result.final_output}")
        last_output = result.final_output
        if i % 2 == 0 and "goodbye" in last_output.lower():
            if verbose:
                print("session end")
            break
        if i > 120:
            print("forced interruption")
            break
        i += 1
    
    # await patient_agent.dump_session(f"./generate_mock_data")
    # await clinician_agent.dump_session(f"./generate_mock_data")

    patient_transcript = await patient_agent.return_session()
    clinician_transcript = await clinician_agent.return_session()

    # combine transcripts
    assert len(patient_transcript) == len(clinician_transcript)
    combined_transcript = []
    for i in range(len(patient_transcript)):
        if i % 2 != 0:
            combined_transcript.append({
                "clinician": clinician_transcript[i]["content"][0]['text'],
                "patient": patient_transcript[i]["content"][0]['text']
            })
    # save combined transcript
    # with open(f"./generate_mock_data/{patient_id}_combined_transcript.json", "w", encoding='utf-8') as f:
    #     json.dump(combined_transcript, f, indent=2)
    return combined_transcript

if __name__ == "__main__":
    context = "Mei Lin is a 20-year-old first-generation college student of Asian descent, currently studying biology at a large public university. She comes from a low-income background, working part-time on campus to support herself financially, which leaves her little time for rest or social activities. As the first in her family to attend college, Mei often feels immense pressure to succeed academically and make her parents proud. She struggles with persistent feelings of isolation, impostor syndrome, and guilt for not being able to support her family more. Recently, she has been experiencing low energy, difficulty concentrating, and trouble sleeping\u9225\u6515ymptoms that have gradually intensified over the past semester. Mei tends to internalize her struggles, fearing she might burden others or confirm cultural stigmas around mental health. Though high-achieving and thoughtful, she is quietly battling depression, uncertain of how to ask for help or where to start."
    asyncio.run(simulate_session("INS-W_963", context))


