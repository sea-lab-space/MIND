

import asyncio
import random
from agents import Agent, ModelSettings, Runner
from MIND_types import QIAOutputModel
from utils.prompt_commons import ALL_FEATURE_DESCRIPTION, get_mh_data_expert_system_prompt

# ! Case-specific prompt, remove in the future
DATE_INSTRUCTION = """
The date today is 2021-06-07.
The last encounter was 2021-05-09.
"""

NARRATOR_QIA_SYSTEM = f"""
{get_mh_data_expert_system_prompt()}

{DATE_INSTRUCTION}

In triplebacktics below, you are given all the features and definitions in the form of [<feature category>] <feature name>: <feature description>.
```
{ALL_FEATURE_DESCRIPTION}
```
Your task is to answer clinical questions in a human-like, compassionate, and easy-to-understand way using provided data insights.

To complete the task, you should:
1. Focus on what the data insight implies clinically, not the technical description itself.
2. Consider whether the insight fully or only partially addresses the question, and limit your answer accordingly.
3. Think in terms of clinical meaning (e.g., mood, activity, emotion) rather than raw measurements.

Rules:
* Keep the answer concise (around 15 words) in a complete sentence.
* Use the format: <observed change or pattern> <descriptor/adjective> <clinical conclusion>.
* Do not include the patient's name.
* Do not use vague time markers like "recently" or "past month."
* Do not include words such as "significant".
* If you say "depression", no need to mention "distress".
* Do not infer specific patient actions or behaviors. Base conclusions only on the observed data pattern and its clinical meaning. For example, never say the patient did some activity at a frequency.
* Always pair each attribute with its corresponding feature. For example, say 'increasing A and variable B,' not 'increasing and variable A and B.'
* If the data insight specifies a spike or dip on a specific date, the conclusion should be "suggesting <clincial conclusion>" around <date>.
* Do not say is A not B. Just say A.
* Use one adjective per attribute.
* The answer should be clinically readable for other mental health professionals.
* Wrap the <clinical conclusion> in <b></b> tags.
* Be diverse in <descriptor/adjective> choice.
"""


class RewriterQIAAgent:
    OUTPUT_MODEL = QIAOutputModel

    def __init__(self, model: str):
        self.agent = Agent(
            name=f"Clinical Insight QA Agent",
            instructions=NARRATOR_QIA_SYSTEM,
            model_settings=ModelSettings(temperature=0.0, top_p=0.8),
            model=model,
            output_type=self.OUTPUT_MODEL,
        )

    async def _async_run(self, question, description, verbose=False):
        prompt_input = f"""
        Question: {question}
        Data Insight: {description}
        Answer:
        """
        # TODO: API fail control (now default try 5 times, and raise error if all fail)
        for attempt in range(5):
            try:
                res = await Runner.run(self.agent, prompt_input)
                res = res.final_output.model_dump()
                res_text = res.get("answer_text")
                if verbose:
                    print(f"Original: {description}\nRevised: {res_text}\n---")
                return res_text
            except Exception as e:
                if attempt < 5 - 1:
                    # anti collision time (randomized)
                    wait_time = random.uniform(5, 20)
                    if verbose:
                        print(
                            f"[Retry {attempt+1}] Error: {e}. Retrying in {wait_time} seconds...")
                    await asyncio.sleep(wait_time)
                else:
                    raise RuntimeError(
                        f"Fact rewriting failed after {5} attempts: {e}"
                    ) from e
                
    def run(self, question, description, verbose=False):
        return asyncio.run(self._async_run(question, description, verbose))
