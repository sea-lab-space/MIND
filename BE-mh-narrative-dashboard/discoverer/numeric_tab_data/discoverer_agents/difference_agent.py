from pydantic import BaseModel, Field
from typing import List, Literal
from discoverer.numeric_tab_data.discoverer_agents.base_agent import BaseDiscovererAgent
from utils.tools import agent_tool_validate_fact_value
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
    value_1: float = Field(..., description="The value of the feature at time_1.")
    value_2: float = Field(..., description="The value of the feature at time_2.")
    fact_description: str = Field(
        ..., description="The [name] was [value_1] on [time_1] and became [attribute] at [value_2] on [time_2]."
    )
    fact_type: Literal['difference']

class DifferenceDiscovererOutput(BaseModel):
    facts: List[FactDifferenceConfig]

class DifferenceDiscovererAgent(BaseDiscovererAgent):
    DEFINITION = r"""
        Difference captures how the value of a feature between two time points change in the data.
    """
    OUTPUT_MODEL = DifferenceDiscovererOutput
    TOOLS = [agent_tool_validate_fact_value]

    def _glue_instructions(self, modality_source, feature_name, feature_definition):
        from discoverer.numeric_tab_data.system_prompt import (
            get_mh_data_expert_modality_prompt,
            get_mh_data_expert_feature_prompt,
            get_mh_data_expert_system_prompt,
            get_mh_data_expert_task_prompt,
            get_mh_data_expert_requirements_prompt,
            get_mh_eveness_prompt,
            get_mh_data_date_prompt
        )

        # {get_mh_data_date_prompt(retrospect_date_str=self.retrospect_date, before_date_str=self.before_date)}

        return f"""
            {get_mh_data_expert_system_prompt()}
            {get_mh_data_expert_modality_prompt(modality_source=modality_source)}
            {get_mh_data_expert_feature_prompt(feature_name=feature_name, feature_definition=feature_definition)}
            {get_mh_data_expert_task_prompt(fact_type="difference", fact_definition=self.DEFINITION)}       
            {get_mh_data_expert_requirements_prompt()}
            {get_mh_eveness_prompt()}
        """.replace("\r", "").replace("\n\n", "\n")
