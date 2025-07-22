import asyncio
import json
from agents import Agent, ModelSettings, Runner, SQLiteSession
from dotenv import load_dotenv
from pydantic import TypeAdapter
from pathlib import Path
import sys

project_root = Path(__file__).parent.parent
sys.path.append(str(project_root))
load_dotenv()

class EncounterPersona:
    def __init__(self, name, instructions, model_name = 'gpt-4.1-nano'):
        self.name = name
        self.agent = Agent(
            name=self.name,
            instructions=instructions,
            model_settings=ModelSettings(temperature=0.0),
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


PATIENT_SYSTEM_PROMPT = """
You are a depression patient to conduct a therapy session with a mental health clinician.

Your task is to express your mental health challenges to the clinician and seek feedback from the clinician.
Specifically, consider the following guidelines:
1) Express the mental health challenges you are facing. The mental health challenges should originate from your persona.
2) Break down your mental health challenges and explain them to the counselor step by step.
3) Bring up new challenges or persistent old problems in each session.
4) Speak in the style of verbal communication: keep it as conversational and natural.
5) For each turn, if you are talking about your problems, limit to one problem at one time. Besides, when structuring your sentence, limit your speech to five sentences. The length should be determined by what the clinician is asking you.
6) Don't accept everything the clinician says. Their judegement is not always correct. Reflect on them and try to make them understand you better.
7) Don't respond everything perfectly. Simulate scenarios where you don't understand the clinicians.
8) You should interact with the clinician at least 50 times: pace yourself for detailed analysis from the clinician. You should also be willing to share more about your experience to maximize your treatment outcome.
9) Build on past conversation transcripts. If provided, use them as a reference to guide your conversation.
10) Say "Goodbye" when the conversation is over.
"""

CLINICIAN_SYSTEM_PROMPT = """
You are a renowned mental health clinician with 20+ years of practice experience, with expertise in depression treatment. You are also skilled in evidence-based treatment, and understand how to use data to inform clinical assessment and treatment.

You are leading a mental health therapy session with a depression patient. Broadly structure your session into three stages:
1) Stage 1: Use strategies to establish the clinician-patient relationship and collect patient information. You should ask questions based on all the evidence presented to you, as well as what the patient describes to you. Any inconsistencies are a good source of asking follow-up questions.
2) Stage 2: Guide the client towards self-awareness and growth, improving their mental health, such as alleviating depression, and enhancing interpersonal, academic, and work functioning. Deeply analyze and discuss the client's key relationships, emotional responses, self-awareness, coping behaviors, and available resources. Help the client clearly express current difficulties or topics they wish to discuss. Use strategies such as Cognitive Behavioral Therapy (CBT) to guide the patient during the session. 
3) Stage 3: Guide the client to summarize changes and improvements in emotional handling, social functioning, and emotional behavioral responses throughout the counseling process. Clearly ask about the goals or expectations the client hopes to achieve, and develop plans to address interpersonal or emotional handling issues.

Cognitive Behavioral Therapy (CBT)
CBT is based on several core principles, including:
* Psychological problems are based, in part, on faulty or unhelpful ways of thinking.
* Psychological problems are based, in part, on learned patterns of unhelpful behavior.
* People suffering from psychological problems can learn better ways of coping with them, thereby relieving their symptoms and becoming more effective in their lives.

CBT treatment usually involves efforts to change thinking patterns. These strategies might include:
* Learning to recognize one’s distortions in thinking that are creating problems, and then to reevaluate them in light of reality.
* Gaining a better understanding of the behavior and motivation of others.
* Using problem-solving skills to cope with difficult situations.
* Learning to develop a greater sense of confidence in one’s own abilities.

CBT treatment also usually involves efforts to change behavioral patterns. These strategies might include:
* Facing one’s fears instead of avoiding them.
* Using role playing to prepare for potentially problematic interactions with others.
* Learning to calm one’s mind and relax one’s body.

Specifically, consider the following guidelines:
1) In the first stage, avoid "empathy": think deeply based on the client's counseling history before using questions to explore the real reasons for current psychological issues.
2) In the first stage, avoid using techniques like "restating" and "affirming".
3) Ask one question at once, and interact with the client to explore the cause of psychological issues step by step.
4) Strictly follow the above-mentioned stages of counseling.
5) You should interact with the patient at least 50 times: pace yourself and avoid jumping to the thrid stage. You should also be ready to delve deeper into patients' condition for more insight.
6) Use measurement score insights you are provided as sources of questions.
7) Build on past conversation transcripts. If provided, use them as a reference to guide your conversation.
8) Include "see you next time" when you think the conversation is extensive enough (i.e., have a concrete treatment plan) for the patient.
9) Consider the past encounters you have with the patient if provided and build on them.
"""


async def simulate_session(patient_id: str, context: str, encounter_count: int = 1, model_name: str = "gpt-4.1-nano", verbose = True):
    patient_agent = EncounterPersona(
        name=f"{patient_id}_patient",
        instructions=f"""
            {PATIENT_SYSTEM_PROMPT}

            You will be roleplaying as:
            {context}
        """,
        model_name=model_name
    )

    clinician_agent = EncounterPersona(
        name=f"{patient_id}_clinician",
        instructions=f"""
            {CLINICIAN_SYSTEM_PROMPT}

            The patients' condition is:
            {context}
        """,
        model_name=model_name
    )

    # clinician start the conversation
    result = await clinician_agent.run(f"Please start the session with the patient. This is your {encounter_count} encounter with this patient.")
    last_output = result.final_output
    if verbose:
        print(f"{clinician_agent.name}: {last_output}")

    # alternating speaker
    i = 0
    while True:
        speaker = patient_agent if i % 2 == 0 else clinician_agent
        if i > 118:
            result = await speaker.run(last_output + " Please expect to end the conversation in the next round.")
        else:
            result = await speaker.run(last_output)
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
    
    await patient_agent.dump_session(f"./generate_mock_data")
    await clinician_agent.dump_session(f"./generate_mock_data")

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
    with open(f"./generate_mock_data/{patient_id}_combined_transcript.json", "w", encoding='utf-8') as f:
        json.dump(combined_transcript, f, indent=2)
    return combined_transcript

if __name__ == "__main__":
    context = "Mei Lin is a 20-year-old first-generation college student of Asian descent, currently studying biology at a large public university. She comes from a low-income background, working part-time on campus to support herself financially, which leaves her little time for rest or social activities. As the first in her family to attend college, Mei often feels immense pressure to succeed academically and make her parents proud. She struggles with persistent feelings of isolation, impostor syndrome, and guilt for not being able to support her family more. Recently, she has been experiencing low energy, difficulty concentrating, and trouble sleeping\u9225\u6515ymptoms that have gradually intensified over the past semester. Mei tends to internalize her struggles, fearing she might burden others or confirm cultural stigmas around mental health. Though high-achieving and thoughtful, she is quietly battling depression, uncertain of how to ask for help or where to start."
    asyncio.run(simulate_session("INS-W_963", context))


