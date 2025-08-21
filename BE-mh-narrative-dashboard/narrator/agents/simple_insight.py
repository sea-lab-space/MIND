

import asyncio
import random
from agents import Agent, ModelSettings, Runner
from MIND_types import InsightGuardrailOutputModel
from utils.prompt_commons import ALL_FEATURE_DESCRIPTION, get_mh_data_expert_system_prompt

# ! Case-specific prompt, remove in the future
DATE_INSTRUCTION = """
The date today is 2021-06-07.
The last encounter was 2021-05-09.
"""

SIMPLE_INSIGHT_SYSTEM = f"""
{get_mh_data_expert_system_prompt()}

{DATE_INSTRUCTION}

In triplebacktics below, you are given all the features and definitions in the form of [<feature category>] <feature name>: <feature description>.
```
{ALL_FEATURE_DESCRIPTION}
```
Your task is to rewrite the insight in a human-like, compassionate, and easy-to-understand way using provided data insights.

To complete the task, you should:
1. Focus on what the data insight implies clinically, not the technical description itself.
2. Think in terms of clinical meaning (e.g., mood, activity, emotion) rather than raw measurements.

Rules:
* Keep the answer concise (around 15 words) in a complete sentence.
* Use the format: <observed change or pattern> <descriptor/adjective> <clinical conclusion>.
* Do not include the patient's name.
* Do not add assumptions about the patient’s behavior beyond what the data directly show. Base conclusions strictly on observed patterns or measurements.
* Do not use vague time markers like "recently" or "past month."
* Do not include words such as "significant".
* Always pair each attribute with its corresponding feature. For example, say 'increasing A and variable B,' not 'increasing and variable A and B.'
* If the data insight specifies a spike or dip on a specific date, the conclusion should be "suggesting <clincial conclusion>" around <date>.
* Do not say is A not B. Just say A.
* Use one adjective per attribute.
* Avoid double negatives. For example, instead of 'heightened physical inactivity,' use 'decreased activity.'
* The answer should be clinically readable for other mental health professionals.
"""


class RewriterSimpleInsightAgent:
    OUTPUT_MODEL = InsightGuardrailOutputModel

    def __init__(self, model: str):
        self.agent = Agent(
            name=f"Simple Insight Rewriter Agent",
            instructions=SIMPLE_INSIGHT_SYSTEM,
            model_settings=ModelSettings(temperature=0.0),
            model=model,
            output_type=self.OUTPUT_MODEL,
        )

    async def _async_run(self, description, verbose=False):
        prompt_input = f"""
        Data Insight: {description}
        Rewrittern Insight:
        """
        # TODO: API fail control (now default try 5 times, and raise error if all fail)
        for attempt in range(5):
            try:
                res = await Runner.run(self.agent, prompt_input)
                res = res.final_output.model_dump()
                res_text = res.get("insight")
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
                
    def run(self, description, verbose=False):
        return asyncio.run(self._async_run(description, verbose))
