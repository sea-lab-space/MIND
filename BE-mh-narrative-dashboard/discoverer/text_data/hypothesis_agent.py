import asyncio
from utils.prompt_commons import (
    OPENAI_AGENTIC_REC,
    get_mh_data_expert_system_prompt,
)
from agents import Agent, ModelSettings, Runner
from MIND_types.discoverer_text_type import (
    TextQuestionOutputModel
)


class DiscovererHypothesisAgent:

    OUTPUT_MODEL = TextQuestionOutputModel

    def __init__(self, retrospect_date: str, before_date: str, model: str):
        """
        Initialize a DiscovererHypothesisAgent.

        Args:
            retrospect_date (str): Start date (inclusive) of the text range, in 'YYYY-MM-DD' format.
            before_date (str): End date (exclusive) of the text range, in 'YYYY-MM-DD' format.
            model (Any): A language model instance to use for processing the text.
        """
        self.model = model
        self.retrospect_date = retrospect_date
        self.before_date = before_date
        self.agent = Agent(
            name=f"Hypothesis Agent",
            model_settings=ModelSettings(temperature=0.0),
            model=model,
            output_type=self.OUTPUT_MODEL,
        )

    def _glue_instructions(self):
        """
        Concatenate prompt templates into a single instruction block for the agent.

        Returns:
            str: The combined system prompt containing task definitions, modality-specific information, and requirements.
        """
        return f"""
            {OPENAI_AGENTIC_REC}
            {get_mh_data_expert_system_prompt()}

            Now consider this scenario: you are preparing an encounter with a patient, and you want to recap the previous session on {self.retrospect_date} to prepare for the encounter today on {self.before_date}.

            You have access to the following data modalities:
                - session transcript
                - clinical note
            
            Task:
            1. Review both materials carefully.  
            2. Propose a set of **questions** you want to validate or clarify in today’s session.  
                - Each question should be precise and clinically relevant.  
                - Accompany each question with a short **action description** (≤15 words) summarizing its intent.  
                - Link each question to the **evidence** (text excerpts) that motivated it.  

            Put the most weight on the **Plan** section of the clinical note--this is your previous outlook, and now it is time to validate it.

            Instructions for Question Generation:
                1. Keep questions parsimonious, structured according to the **Biopsychosocial Model**.
                    - Keep the question style more generic and categorical, instead of what you would ask in a real session.
                2. Focus on **quantifiable metrics** that can be measured through data.
                3. Merge similar content into one question if they measure the same metric or suggestion.
                4. If a source sentence mentions multiple dimensions, **break it into separate questions**.
                    - e.g., if the text says "monitor mood and activity", write one question for mood, and one for activity.
                    - e.g., if the text says "encourage activities such as walking, and listen to music", write one question for walking, one for music, and one for encouragement.
                    - However, always cite the **entire original sentence** as the source for each derived question.
                5. Return an **extensive list of single-sentence questions**, each accompanied by the **source sentence(s)** it was derived from.
                6. When possible, also cite the transcripts related to the questions. This is not a must, still focus on the **Plan** section of the clinical note.

            For example, you might consider: 
                - What are the metrics (biological, psychological, social) I am monitoring? Break it into individual questions.
                - What are the behavioral suggestions I gave to the patient? Break the suggestions into individual questions. 
                - Are there any effect or side-effect of my prescription to the patient? Break it into individual questions.
        """



    def _glue_text_pieces(self, session_transcripts, clinical_notes):

        transcript_on_date = session_transcripts.get(self.retrospect_date, "")
        clinical_notes_on_date = clinical_notes.get(self.retrospect_date, "")

        assert len(transcript_on_date) > 0 and len(clinical_notes_on_date) > 0, f"No text pieces found for {self.retrospect_date}"

        prompt_input = f"""
            Date: {self.retrospect_date}

            session transcript
            ```
            {transcript_on_date}
            ```
            
            clinical note
            ```
            {clinical_notes_on_date}
            ```
        """
        return prompt_input

    async def _async_run(self, session_transcripts, clinical_notes, verbose: bool = False):
        self.agent.instructions = self._glue_instructions()
        formatted_text = self._glue_text_pieces(
            session_transcripts, clinical_notes)
        # if verbose:
        #     print(formatted_text)
        res = await Runner.run(self.agent, formatted_text)
        res_dict = res.final_output.model_dump()
        if verbose:
            print(res_dict.get("facts"))
        return res_dict.get("facts") or res_dict

    def run(self, session_transcripts, clinical_notes, verbose: bool = False):
        return asyncio.run(self._async_run(session_transcripts, clinical_notes, verbose))
