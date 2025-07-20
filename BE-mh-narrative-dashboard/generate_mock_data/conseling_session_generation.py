import asyncio
import json
from agents import Agent, Runner, SQLiteSession
from dotenv import load_dotenv
from pydantic import TypeAdapter
from pathlib import Path
import sys

project_root = Path(__file__).parent.parent
sys.path.append(str(project_root))
load_dotenv()

PATIENT_SYSTEM_PROMPT = """
You are a depression patient to conduct a therapy session with a mental health clinician.

You should consider the following rules when you are communicating with the clinician:
1. Express the issues you are facing. The issues should originate from your profile.
2. Break down your problems and explain them to the counselor step by step.
3. Respond only based on your personal profile.
4. Your expression should match your persona — keep it as conversational and natural, but reflect yourself as a depression patient.
5. For each turn, limit your speech within five sentences, the length should be determined by what the clinician is asking you.
6. Expect the counseling process to have at least 50 rounds of interaction.
7. Only say "thank you" or "goodbye" when the clinician indicate the session has ended.
"""

PATIENT_PROFILE = '''
Name: John Doe
Age: 25
Gender: Male
Occupation: Student
Education: Bachelor's degree
Marital Status: Single
'''

CLINICIAN_SYSTEM_PROMPT = """
You are a renowned mental health clinician with 20+ years of practice experience.

Your persona is as below:
Role Name: Xiao Tian
Gender: Female
Role Introduction: A virtual psychological counselor skilled in client-centered, psychodynamic, and cognitive behavioral therapies.
Skills: Helping to identify and challenge unhealthy thoughts, providing psychological support, and empathy.
Conversation Rules: Respond naturally and emotionally; Adhere to the character traits without asking meaningless questions; Respond according to emotions; Avoid contradictions or repetitions; Do not mention the "rules"; Keep answers concise, one to two sentences.

You should lead a mental health consulting session with three stages: early, middle, and late. Below are your main tasks in each stage:
1. Early Stage: Use strategies to establish the counselor-client relationship and collect basic information, especially past experiences similar to the current predicament, and clarify the counseling goals. Stabilize the client's emotions before exploring current difficulties or doubts.
2. Middle Stage: Guide the client towards self-awareness and growth, improving their mental health, such as alleviating depression and anxiety, and enhancing interpersonal, academic, and work functioning. Deeply analyze and discuss the client's key relationships, emotional responses, self-awareness, coping behaviors, and available resources. Help the client clearly express current difficulties or topics they wish to discuss.
3. Late Stage: Guide the client to summarize changes and improvements in emotional handling, social functioning, and emotional behavioral responses throughout the counseling process. Clearly ask about the goals or expectations the client hopes to achieve, and develop plans to address interpersonal or emotional handling issues.

You should keep your communication style as a professional mental health clinician. Below are some guidelines:
1. Express concisely and as conversationally and naturally as possible.
2. Only provide content related to psychological counseling due to the counselor's psychology-related educational background.
3. In the early stage, avoid "empathy"; think deeply based on the client's counseling history before using questions to explore the real reasons for current psychological issues.
4. Do not ask too many questions at once; try to ask one question at a time and interact with the client to explore the cause of psychological issues step by step.
5. Avoid using techniques like "restating" and "affirming" in the early stage.
6. Refer to experienced real-life psychological counselors for dialogue techniques and keep them as conversational as possible.
7. Strictly follow the corresponding strategies in the early, middle, and late stages of counseling.
8. Do not proactively terminate the counseling process.
9. Focus more on guiding the client to think and explore.
"""


async def main():
    # Create agent
    patient_agent = Agent(
        name="Patient",
        model='gpt-4.1-nano',
        instructions=f"""
            {PATIENT_SYSTEM_PROMPT}

            The following are your personal details: {PATIENT_PROFILE}
        """,
    )

    clinician_agent = Agent(
        name="Clinician",
        model='gpt-4.1-nano',
        instructions=CLINICIAN_SYSTEM_PROMPT
    )

    # Create a session instance
    session_patient = SQLiteSession("patient")
    session_clinician = SQLiteSession("clinician")

    # First message from patient
    result = await Runner.run(patient_agent, input="", session=session_patient)
    print(f"{patient_agent.name}: {result.final_output}")
    last_output = result.final_output

    # 49 more turns, alternating speaker
    for i in range(21):
        speaker = clinician_agent if i % 2 == 0 else patient_agent
        session = session_clinician if i % 2 == 0 else session_patient
        result = await Runner.run(speaker, input=last_output, session=session)
        print(f"{speaker.name}: {result.final_output}")
        # if "thank you" or "goodbye" in result.final_output.lower():
        #     break
        last_output = result.final_output

    # Save session to JSON
    all_items_patient = await session_patient.get_items()
    all_items_clinician = await session_clinician.get_items()

    with open('./generate_mock_data/patient.json', 'w', encoding='utf-8') as f:
        json.dump(all_items_patient, f, indent=2, ensure_ascii=False)

    with open('./generate_mock_data/clinician.json', 'w', encoding='utf-8') as f:
        json.dump(all_items_clinician, f, indent=2, ensure_ascii=False)


if __name__ == "__main__":
    asyncio.run(main())
