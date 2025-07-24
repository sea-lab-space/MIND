from pydantic import BaseModel, Field
from typing import List, Literal
from discoverer.numeric_tab_data.discoverer_agents.base_agent import BaseDiscovererAgent

class FactTrendConfig(BaseModel):
    # fact_description: The natural language description of the data fact
    # The [attribute] of [name] is [value] at [time].
    name: str = Field(...,
                      description="Name of the feature being analyzed or transformed.")
    attribute: Literal['rise', 'fall', 'stable', 'cyclic'] = Field(
        ..., description="The attribute of the feature, one of rise, fall, stable, and cyclic.")
    time_1: str = Field(...,
                      description="The start time of trend, in YYYY-MM-DD format.")
    time_2: str = Field(...,
                      description="The end time of trend, in YYYY-MM-DD format.")
    fact_description: str = Field(
        ..., description="[The] [name] showed a [attribute] trend from [time_1] to [time_2].")
    fact_type: Literal['trend']
    
class TrendDiscovererOutput(BaseModel):
    facts: List[FactTrendConfig]


class TrendDiscovererAgent(BaseDiscovererAgent):
    DEFINITION = r"""
        Trend describes the general tendency of a feature over a specified time period, characterized as one of the following: rise, fall, stable, or cyclic.
    """
    OUTPUT_MODEL = TrendDiscovererOutput

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
            {get_mh_data_expert_task_prompt(fact_type="trend", fact_definition=self.DEFINITION)}            
            {get_mh_data_expert_requirements_prompt()}
            {get_mh_eveness_prompt()}       
        """.replace("\r", "").replace("\n\n", "\n")
