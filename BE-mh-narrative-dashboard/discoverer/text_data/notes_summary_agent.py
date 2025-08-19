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

Your task is to provide two concise summaries:
1. Symptoms & Observations (S/O):
* In ≤15 words, summarize key symptoms or findings.
* Cite the exact sentence(s) from the note as evidence.
* Start with: Reported/observed...

2. Assessment (A):
* In ≤15 words, summarize key assessment.
* Cite the exact sentence(s) from the note as evidence.
* Start with: Assessed...

Rules:
1. Do not invent any information.  
2. Do not omit any original text; include the text exactly as it appears.  
3. Split the evidence into individual sentences if the evidence is too long.

Let's think step by step.
"""


class NotesCardSummaryAgent:

    OUTPUT_MODEL = TextDataDiscoveryOutputModel

    def __init__(self, retrospect_date: str, before_date: str, model: str):
        """
        Initialize a TextDiscovererAgent.

        Args:
            modality_source (Literal): Source of the clinical text ('clinical transcript' or 'clinical notes').
            retrospect_date (str): Start date (inclusive) of the text range, in 'YYYY-MM-DD' format.
            before_date (str): End date (exclusive) of the text range, in 'YYYY-MM-DD' format.
            model (Any): A language model instance to use for processing the text.
        """
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
