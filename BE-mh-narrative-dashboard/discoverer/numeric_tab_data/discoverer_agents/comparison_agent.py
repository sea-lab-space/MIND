from pydantic import BaseModel, Field
from typing import List, Literal
from discoverer.numeric_tab_data.discoverer_agents.base_agent import BaseDiscovererAgent

class TimeDuration(BaseModel):
    time_start: str = Field(...,
                            description="The start time of the period, in YYYY-MM-DD format.")
    time_end: str = Field(...,
                          description="The end time of the period, in YYYY-MM-DD format.")

# Rationale: This is a compount fact (a generalized case for difference): there is no meaning comparing two individual values in mh.
class FactComparisonConfig(BaseModel):
    name: str = Field(...,
                      description="Name of the feature being analyzed or transformed.")
    attribute: str = Field(
        ..., description="The attribute of the feature, including but not limited to greater than, less than, etc."
    )
    time_dur_1: TimeDuration = Field(
        ..., description="The base time period of comparison, in YYYY-MM-DD format."
    )
    time_dur_2: TimeDuration = Field(
        ..., description="The second time period of comparison, in YYYY-MM-DD format."
    )
    fact_description: str = Field(
        ..., description="The [name] [attribute] from [time_dur_1] [value_description] to [time_dur_2] [value_description]."
    )
    fact_type: Literal['comparison']


class ComparisonDiscovererOutput(BaseModel):
    facts: List[FactComparisonConfig]


class ComparisonDiscovererAgent(BaseDiscovererAgent):
    DEFINITION = r"""
        Comparison captures how the average value of a feature between two time periods (time_dur_1, time_dur_2) change in the data.
    """
    OUTPUT_MODEL = ComparisonDiscovererOutput

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
            {get_mh_data_expert_task_prompt(fact_type="comparison", fact_definition=self.DEFINITION)}       
            {get_mh_data_date_prompt(retrospect_date_str=self.retrospect_date, before_date_str=self.before_date, is_comparison=True)}
            {get_mh_data_expert_requriements_prompt()}
        """.replace("\r", "").replace("\n\n", "\n")
