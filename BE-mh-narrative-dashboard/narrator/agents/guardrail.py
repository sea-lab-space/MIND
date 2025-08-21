
from agents import Agent, ModelSettings, Runner
from MIND_types import InsightGuardrailOutputModel


NARRATOR_GUARDRAIL_SYSTEM = f"""
You are an expert in clinical mental health narrative generation.
Given a |data insight| and its associated |data facts|, identify and correct any hallucinations in the insight.

A hallucination refers to any statement, interpretation, or conclusion that goes beyond what is directly supported by the provided data facts. This includes overgeneralization, causal inference, or assumptions not explicitly evidenced in the facts.
One concrete example include:
* If the |data insight| suggests some behaviour persists, it should only refer to |data facts| that explicitly uses numbers.

Task:
* Review the data insight in light of the data facts.
* If you detect hallucination, return a revised version of the data insight with all hallucinations removed or reworded to strictly reflect what the data supports.

When rewriting the insights, follow the guidelines:
* Use the original text if no hallucination is detected.
* Be concrete, specific, but succinct. Do not use more than 12 words for each data insight.
* When hard to describe in less than 12 words, pick the most important insight, that is, the one that is most likely to be the most relevant to the patient's condition and/or backed by data facts.
* Do not explicity mention any date related in the insights.
* Do not start with "Patient", "He/she" or patient name.
* Aviod confusing information. For example, don't say "Physical activity decreased, with brief increases in steps and exercise time", leave one, either "physical activity decreased during <dates>" or "brief increases in steps and excercise time during <dates>".
* Keep only one sentence, and end that sentence with a period.
* Avoid using semicolons to connect sentences.
* Reference the styles given below.

Below are some good examples provided by a mental health expert. Mimic the succinct insight description style and learn from the examples.
* Growing activity despite fatigue.
* Fragmented digital engagement.
* Increased social activity, in a closed circle.
"""

# * Contextualize dates and times, e.g., "for 1 week", "for 3 days". For insights on a specific date, do not mention the year.
# * The general style should follow: <observation> + <contrast/effect>
# * Transient mood lift after activity; discouragement and self-criticism returning within an hour.
# * Maintains work and therapy attendance; finds routine helpful but exhausting.
# * Sertraline taken daily for 1 week with no side effects; benefit remains unclear.


class GuardrailNarratorAgent:
    OUTPUT_MODEL = InsightGuardrailOutputModel

    def __init__(self, model: str):
        self.agent = Agent(
            name=f"Deduplication agent",
            instructions=NARRATOR_GUARDRAIL_SYSTEM,
            model_settings=ModelSettings(temperature=0.2, top_p=0.1),
            model=model,
            output_type=self.OUTPUT_MODEL,
        )

    async def run(self, data_insight_descriptions, data_facts, verbose=False):
        prompt_input = f"|data insight|: {data_insight_descriptions}\n|data facts|: {data_facts}"
        res = await Runner.run(self.agent, prompt_input)
        res = res.final_output.model_dump()
        res_text = res.get("insight")
        if verbose:
            print(
                f"Original: {data_insight_descriptions}\nRevised: {res_text}\n---")
        return res_text
