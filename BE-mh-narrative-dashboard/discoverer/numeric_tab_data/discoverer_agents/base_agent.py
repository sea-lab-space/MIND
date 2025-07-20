import pandas as pd
from typing import List, Optional, Type
from pydantic import BaseModel
from typing import List
from abc import ABC, abstractmethod
from datetime import datetime

from discoverer.numeric_tab_data.descriptions.defs import NUMERICAL_FEATURE_DEFS

# TODO: Didn't consider - 1) tool use (but left API), 2) time retrospect (debatable: should we consider?)
class BaseDiscovererAgent(ABC):
    """
    BaseDiscoverer: A generic base class for data-driven discoverer agents.
    
    Args:
        retrospect_date (str): The date for retrospective analysis, YYYY-MM-DD.
        model (str): LLM model name.
        tools (Optional[List[Callable]]): Optional list of function tools to enable during execution.
    """

    DEFINITION: str = "Generic data discovery task."
    OUTPUT_MODEL: Type[BaseModel] = BaseModel

    def __init__(
        self,
        retrospect_date: str,
        before_date: str,
        model: str = "gpt-4.1-nano",
        tools: Optional[List] = None
    ):
        assert datetime.strptime(
            retrospect_date, "%Y-%m-%d") < datetime.strptime(before_date, "%Y-%m-%d"), "Retrospect date must be before or equal to before date."
        
        self.retrospect_date = retrospect_date
        self.before_date = before_date
        self.model = model
        self.tools = tools or []

        from agents import Agent, ModelSettings

        self.agent = Agent(
            name=self.__class__.__name__,
            model_settings=ModelSettings(temperature=0.0),
            model=model,
            output_type=self.OUTPUT_MODEL,
            tools=self.tools
        )

    @abstractmethod
    def _glue_instructions(self, modality_source: str, feature_name: str, feature_definition: str) -> str:
        pass

    def _feature_to_csv(self, feature_data) -> str:
        """Convert feature data (list of dicts) to CSV string."""
        df = pd.DataFrame(feature_data)
        df["datetime"] = pd.to_datetime(df["date"])
        before_dt = datetime.strptime(self.before_date, "%Y-%m-%d")
        df = df[df["datetime"] <= before_dt]
        # delete this excess column
        df = df.drop(columns=["datetime"])
        # print(df.to_csv(index=False))
        return df.to_csv(index=False)

    async def run(self, feature: dict, verbose: bool = False) -> dict:
        """
        Run the discoverer on the given feature dict.
        
        Args:
            feature (dict): Must contain keys 'modality_source', 'feature_name', and 'data'.
            verbose (bool): Whether to print the output.
            
        Returns:
            Parsed facts or results from the model output.
        """
        self.agent.instructions = self._glue_instructions(
            modality_source=feature["modality_source"],  # e.g., bluetooth
            feature_name=feature["feature_name"],  # e.g., battery level
            feature_definition=NUMERICAL_FEATURE_DEFS[feature["modality_source"]
                                                      ][feature["feature_name"]]
        )

        csv_str = self._feature_to_csv(feature['data'])
        data_input = f'Data:\n{csv_str}'

        from agents import Runner
        res = await Runner.run(self.agent, input=data_input)
        res_dict = res.final_output.model_dump()
        if verbose:
            print(res_dict.get("facts"))
        return res_dict.get("facts") or res_dict