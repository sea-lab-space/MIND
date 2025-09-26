from typing import List

from agents import Agent, ModelSettings, Runner


NARRATOR_DEDUPLICATION_SYSTEM = f"""
You are an expert in clinical mental health narrative generation.
Given a |data insight| and its associated |data facts|, identify and deduplicate the facts.

Redundancy may occur:
* Within a single modality (e.g., multiple facts of the same type that equally support the insight).
* Within the same category (e.g., similar insights about phychological, biological, or social factors).

Task: Return the IDs of the unique, non-redundant data facts that best support the insight. 
Requirement:
* Preserve the most important supporting data fact for each insight.
* Rank the reduced data facts by their importance to the insight. Assume numerical facts (starts with survey or ps) as more important than textual facts (starts with text).
* Make sure to return at least 1 data fact.
"""

# ! For expanded card (disabled in final version)

class DeduplicationNarratorAgent:
    OUTPUT_MODEL = List[str]

    def __init__(self, model: str):
        self.agent = Agent(
            name=f"Deduplication agent",
            instructions=NARRATOR_DEDUPLICATION_SYSTEM,
            model_settings=ModelSettings(temperature=0.2, top_p=0.1),
            model=model,
            output_type=self.OUTPUT_MODEL,
        )

    async def run(self, data_insight_descriptions, data_facts, verbose=False):
        prompt_input = f"|data insight|: {data_insight_descriptions}\n|data facts|: {data_facts}"
        res = await Runner.run(self.agent, prompt_input)
        res_list = res.final_output
        if verbose:
            print(f"Reduced: {len(data_facts) - len(res_list)} data facts")
        return res_list
