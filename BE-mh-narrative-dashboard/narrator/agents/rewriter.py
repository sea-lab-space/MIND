

import asyncio
import random
from agents import Agent, ModelSettings, Runner
from MIND_types import RewriterOutputModel
from utils.prompt_commons import ALL_FEATURE_DESCRIPTION_W_UNITS

# ! Case-specific prompt, remove in the future
DATE_INSTRUCTION = """
The date today is 2021-06-07.
The last encounter was 2021-05-09.
"""

NARRATOR_REWRITER_SYSTEM = f"""
You are an expert in clinical mental health narrative generation.
Given a |data fact|, rewrite it to be more descriptive and less technical.

{DATE_INSTRUCTION}

In triplebacktics below, you are given all the features and definitions in the form of [<feature category>] <feature name> (<feature unit>): <feature description>.
```
{ALL_FEATURE_DESCRIPTION_W_UNITS}
```

Requirements:
* Format the dates in your output:
  * For single dates, use the dates verbatim (e.g., 2021-05-12, 2021-06-04).
  * For date ranges, use the format "from <start_date> to <end_date> (<x> days/weeks)" (e.g., from 2021-05-12 to 2021-05-16 (4 days)).
* For values, contextualize the data (high, low etc.) using the above knowledge.
* For values, put its corresponding unit after the value (e.g., 5.5 kg, 3.2 mmHg). Note that some values does not have units, in which case you should not add any unit.
* For each data fact, describe it with similar length to the original text.
* Do not add any new information. 
* If dates are already mentioned, don't need to end with descriptions such as "on that date", "during this period" etc.
* The text should be clinically readable for other mental health professionals.
"""
# * Do not infer the speed of the data change (i.e., don't use words like steadily, sharply, etc.).
# * Remove any mention of a concrete year(e.g., 2021).
# * Bold the <feature name> with <wsv></wsv>



class RewriterNarratorAgent:
    OUTPUT_MODEL = RewriterOutputModel

    def __init__(self, model: str):
        self.agent = Agent(
            name=f"Rewriter data fact agent",
            instructions=NARRATOR_REWRITER_SYSTEM,
            model_settings=ModelSettings(temperature=0.2, top_p=0.1),
            model=model,
            output_type=self.OUTPUT_MODEL,
        )

    async def run(self, data_fact, verbose=False):
        prompt_input = f"|data fact|: {data_fact}"
        # TODO: API fail control (now default try 5 times, and raise error if all fail)
        for attempt in range(5):
            try:
                res = await Runner.run(self.agent, prompt_input)
                res = res.final_output.model_dump()
                res_text = res.get("rewritten_data_fact")
                if verbose:
                    print(f"Original: {data_fact}\nRevised: {res_text}\n---")
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
