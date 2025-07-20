from pydantic import BaseModel, Field
from typing import List, Literal
from discoverer.numeric_tab_data.discoverer_agents.base_agent import BaseDiscovererAgent
    
class FactDifferenceConfig(BaseModel):
    name: str = Field(...,
                      description="Name of the feature being analyzed or transformed.")
    attribute: Literal['more', 'less'] = Field(
        ..., description="The attribute of the feature, more or less."
    )
    time_1: str = Field(...,
                        description="The first timepoint, in YYYY-MM-DD format.")
    time_2: str = Field(...,
                        description="The second timepoint, in YYYY-MM-DD format.")
    fact_description: str = Field(
        ..., description="The [name] is [attribute] from [time_1] at [value] to [time_2] at [value]."
    )
    fact_type: Literal['difference']


class DifferenceDiscovererOutput(BaseModel):
    facts: List[FactDifferenceConfig]


class DifferenceDiscovererAgent(BaseDiscovererAgent):
    DEFINITION = r"""
        Difference captures how the value of a feature between two time points change in the data.
    """
    OUTPUT_MODEL = DifferenceDiscovererOutput

    def _glue_instructions(self, modality_source, feature_name, feature_definition):
        from discoverer.numeric_tab_data.system_prompt import (
            get_mh_data_expert_modality_prompt,
            get_mh_data_expert_feature_prompt,
            get_mh_data_expert_system_prompt,
            get_mh_data_expert_task_prompt,
            get_mh_data_expert_requriements_prompt,
            get_mh_data_date_prompt
        )

        # {get_mh_data_date_prompt(retrospect_date_str=self.retrospect_date, before_date_str=self.before_date)}

        return f"""
            {get_mh_data_expert_system_prompt()}
            {get_mh_data_expert_modality_prompt(modality_source=modality_source)}
            {get_mh_data_expert_feature_prompt(feature_name=feature_name, feature_definition=feature_definition)}
            {get_mh_data_expert_task_prompt(fact_type="difference", fact_definition=self.DEFINITION)}       
            {get_mh_data_date_prompt(retrospect_date_str=self.retrospect_date, before_date_str=self.before_date, is_comparison=True)}
            {get_mh_data_expert_requriements_prompt()}
        """.replace("\r", "").replace("\n\n", "\n")
