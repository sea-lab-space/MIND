import asyncio
from utils.prompt_commons import (
    OPENAI_AGENTIC_REC,
    get_mh_data_expert_system_prompt,
)
from agents import Agent, ModelSettings, Runner
from MIND_types.discoverer_text_type import (
    TextDataDiscoveryOutputModel
)

CARD_SUMMARY_PROMPT = f"""
{OPENAI_AGENTIC_REC}
{get_mh_data_expert_system_prompt()}

Now consider this scenario: you are preparing an encounter with a patient, and you want to recap the previous session to prepare for the encounter today.

You have access to the previous clinical note, written in the SOAP note format.

Your task is to provide three concise summaries:
1. Subjective & Objective (S/O):
* In ≤12 words, summarize key subjective or objective symptoms or findings.
* Cite the exact sentence(s) from the note as evidence.
* Start with: <b>Subjective/Objective</b>: (keep this HTML tag)

2. Assessment (A):
* In ≤12 words, summarize key assessment.
* Make the sentence readible, e.g., when describing engagement in threapy, don't just say "show engagement", say "show <activity name> participation".
* Cite the exact sentence(s) from the note as evidence.
* Start with: <b>Assessment</b>: (keep this HTML tag)

3. Plan (P):
- In ≤10 words, summarize the medication prescribed.  
- If yes:
  - If the same as the last session: write "Continue <medication name> (<dosage>, <frequency>)."
  - If new or changed: just write "Prescribed <medication name> (<dosage>, <frequency>)."
  - <frequency> should be described like "once daily", don't need to specify at which point of day.
- If none: write "No medication prescribed." 
- Start with: <b>Medication Plan</b>:  (keep this HTML tag)

Rules:
1. Do not invent any information.  
2. Do not omit any original text; include the text exactly as it appears.  
3. Split the evidence into individual sentences if the evidence is too long.
4. Make sure to keep the specified HTML tag in the output.

Let's think step by step.
"""


class NotesCardSummaryAgent:

    OUTPUT_MODEL = TextDataDiscoveryOutputModel

    def __init__(self, retrospect_date: str, before_date: str, model: str):
        self.model = model
        self.retrospect_date = retrospect_date
        self.before_date = before_date
        self.agent = Agent(
            name=f"Notes Card Summary Agent",
            model_settings=ModelSettings(temperature=0.0),
            model=model,
            instructions=CARD_SUMMARY_PROMPT,
            output_type=self.OUTPUT_MODEL,
        )

    def _glue_text_pieces(self, clinical_notes):

        clinical_notes_on_date = clinical_notes.get(self.retrospect_date, "")

        assert len(clinical_notes_on_date) > 0, f"No text pieces found for {self.retrospect_date}"

        prompt_input = f"""
            Date: {self.retrospect_date}

            clinical note
            ```
            {clinical_notes_on_date}
            ```
        """
        return prompt_input

    async def _async_run(self, text_pieces, verbose: bool = False):
        formatted_text = self._glue_text_pieces(text_pieces)
        if verbose:
            print(formatted_text)
        res = await Runner.run(self.agent, formatted_text)
        res_dict = res.final_output.model_dump()
        if verbose:
            print(res_dict.get("facts"))
        return res_dict.get("facts") or res_dict

    def run(self, clinical_notes, verbose: bool = False):
        return asyncio.run(self._async_run(clinical_notes, verbose))
