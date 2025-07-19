from pydantic import BaseModel, Field
from typing import List, Literal
from discoverer.numeric_tab_data.discoverer_agents.base_agent import BaseDiscovererAgent


class FactFeatureConfig(BaseModel):
    # fact_description: The natural language description of the data fact
    # The [attribute] of [name] is [value] at [time].
    name: str = Field(...,
                      description="Name of the feature being analyzed or transformed.")
    attribute: Literal['min', 'max'] = Field(
        ..., description="The attribute of the feature, max or min.")
    time: str = Field(...,
                      description="The time of the feature, in YYYY-MM-DD format.")
    value: float = Field(..., description="The numeric value of the feature.")
    fact_description: str = Field(
        ..., description="The [attribute] of [name] is [value] at [time].")


class ExtremeDiscovererOutput(BaseModel):
    facts: List[FactFeatureConfig]


class ExtremeDiscovererAgent(BaseDiscovererAgent):
    DEFINITION = r"""
        Extreme captures local minima and maxima (i.e., valleys and peaks) in the data.
    """
    OUTPUT_MODEL = ExtremeDiscovererOutput

    def _glue_instructions(self, modality_source, feature_name, feature_definition):
        from discoverer.numeric_tab_data.system_prompt import (
            get_mh_data_expert_modality_prompt,
            get_mh_data_expert_feature_prompt,
            get_mh_data_expert_system_prompt,
            get_mh_data_expert_task_prompt,
            get_mh_data_expert_requriements_prompt,
        )

        return f"""
            {get_mh_data_expert_system_prompt()}
            {get_mh_data_expert_modality_prompt(modality_source=modality_source)}
            {get_mh_data_expert_feature_prompt(feature_name=feature_name, feature_definition=feature_definition)}
            {get_mh_data_expert_task_prompt(fact_type="extreme", fact_definition=self.DEFINITION)}            
            {get_mh_data_expert_requriements_prompt()}
            The retrospect date is {self.retrospect_date}.
        """.replace("\r", "").replace("\n\n", "\n")
