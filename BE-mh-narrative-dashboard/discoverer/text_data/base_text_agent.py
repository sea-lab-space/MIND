from utils.prompt_commons import (
    OPENAI_AGENTIC_REC, 
    get_mh_data_expert_system_prompt,
)
from agents import Agent, ModelSettings, Runner
from typing import Literal
from datetime import datetime
from MIND_types.discoverer_text_type import (
    TextDataDiscoveryOutputModel
)

def get_mh_data_expert_modality_prompt(modality_source: Literal['clinical transcript', 'clinical notes']):
    return f"""
        You are given the {modality_source}.
    """

def get_mh_data_expert_task_prompt():
    return f"""
        You task is to extract factual descriptions about the patients medical condition from the text.
    """

def get_mh_data_expert_requirements_prompt():
    return f"""
        The data fact you extracted should be of mental health clinical interest.
        
        Describe the data fact in a way that is easy to understand for a mental health expert. 
        Ensure this description is useful for mental health inference, but just describe the data fact. For example, do not say the data 'indicates' or 'suggests' anything.
        Leave the description focused on this type of data fact type. 
        
        You should return as many data facts as possible. Each data fact should be a single sentence.
    
        Return both the data fact and the evidences in original source text that support it.
        Let’s think step by step. 
    """

class BaseTextDiscovererAgent:
    """
    A class that wraps an LLM-powered agent for discovering relevant facts from clinical text 
    (e.g., transcripts or notes) within a specified retrospective time window.

    This agent is designed to synthesize information from multiple dated clinical text entries 
    and extract structured factual data based on predefined prompts and task definitions.

    Attributes:
        OUTPUT_MODEL (Type): The output data model class (e.g., Pydantic) used to structure extracted facts.
        model (str): The LLM instance to be used for inference.
        retrospect_date (str): The start date (inclusive) of the text window in format 'YYYY-MM-DD'.
        before_date (str): The end date (exclusive) of the text window in format 'YYYY-MM-DD'.
        modality_source (Literal): Type of clinical text, either 'clinical transcript' or 'clinical notes'.
        agent (Agent): An initialized LLM agent with appropriate instructions and output settings.
    """

    OUTPUT_MODEL = TextDataDiscoveryOutputModel

    def __init__(self, modality_source: Literal['clinical transcript', 'clinical note'], retrospect_date: str, before_date: str, model: str):
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
        self.modality_source = modality_source
        self.agent = Agent(
            name=f"{self.modality_source} Text Discoverer",
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
            {get_mh_data_expert_modality_prompt(self.modality_source)}
            {get_mh_data_expert_task_prompt()}
            {get_mh_data_expert_requirements_prompt()}
        """

    def _glue_text_pieces(self, text_pieces):
        """
        Format and filter text entries that fall within the retrospective time window.

        Args:
            text_pieces (Dict[str, str]): A dictionary mapping date strings to text content.

        Returns:
            str: Formatted multiline string containing all relevant text pieces within the date range.

        Raises:
            AssertionError: If no valid text entries are found within the date range.
        """
        formatted_texts = []
        for date, text in text_pieces.items():
            if datetime.strptime(date, "%Y-%m-%d") < datetime.strptime(self.before_date, "%Y-%m-%d") and datetime.strptime(date, "%Y-%m-%d") >= datetime.strptime(self.retrospect_date, "%Y-%m-%d"):
                formatted_texts.append(
                    f"Date: {date}\n{self.modality_source.capitalize()}: {text}")
        assert len(
            formatted_texts) > 0, f"No text pieces found for {self.retrospect_date} to {self.before_date}"
        return "\n\n".join(formatted_texts)

    async def run(self, text_pieces, verbose: bool = False):
        """
        Execute the agent to extract structured facts from the selected clinical texts.

        Args:
            text_pieces (Dict[str, str]): A mapping of date strings to raw text data.
            verbose (bool): If True, prints the formatted text and results for debugging.

        Returns:
            Union[Dict[str, Any], Any]: A dictionary containing extracted factual data, or raw model output if no facts found.
        """
        self.agent.instructions = self._glue_instructions()
        formatted_text = self._glue_text_pieces(text_pieces)
        if verbose:
            print(formatted_text)
        res = await Runner.run(self.agent, formatted_text)
        res_dict = res.final_output.model_dump()
        if verbose:
            print(res_dict.get("facts"))
        return res_dict.get("facts") or res_dict
