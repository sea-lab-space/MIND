from pydantic import BaseModel, Field
from typing import List, Literal
from discoverer.numeric_tab_data.discoverer_agents.base_agent import BaseDiscovererAgent
from utils.tools import (
    agent_tool_calculate_average,
    agent_tool_calculate_max,
    agent_tool_calculate_median,
    agent_tool_calculate_min,
    agent_tool_calculate_stdev,
)
from utils.prompt_commons import OPENAI_AGENTIC_REC, OPENAI_AGENTIC_TOOL_USE, OPENAI_AGENTIC_PLANNING

class FactDerivedValueConfig(BaseModel):
    name: str = Field(...,
                      description="Name of the feature being analyzed or transformed.")
    aggregation: Literal['average', 'stdev', 'median', 'max', 'min'] = Field(
        ..., description="The aggregation method of the feature, one of average, stdev, median, max, and min."
    )
    time_1: str = Field(...,
                        description="The first timepoint, in YYYY-MM-DD format.")
    time_2: str = Field(...,
                        description="The second timepoint, in YYYY-MM-DD format.")
    value: float = Field(..., description="The numeric value of the feature.")
    fact_description: str = Field(
        ..., description="The [aggregation] [name] became [attribute] from [value_dur_1] in [time_dur_1] to [value_dur_2] in [time_dur_2]."
    )
    fact_type: Literal['derived value']


class DerivedValueDiscovererOutput(BaseModel):
    facts: List[FactDerivedValueConfig]


class DerivedValueDiscovererAgent(BaseDiscovererAgent):
    DEFINITION = r"""
        Derived value is a value calculated from a set of data points based on a specific aggregation.
    """
    OUTPUT_MODEL = DerivedValueDiscovererOutput
    TOOLS = [
        agent_tool_calculate_average,
        agent_tool_calculate_max,
        agent_tool_calculate_median,
        agent_tool_calculate_min,
        agent_tool_calculate_stdev,
    ]

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
        # {get_mh_data_date_prompt(retrospect_date_str=self.retrospect_date,
        #                          before_date_str=self.before_date, is_comparison=True)}

        return f"""
            {OPENAI_AGENTIC_REC}
            {OPENAI_AGENTIC_TOOL_USE}
            {OPENAI_AGENTIC_PLANNING}
            {get_mh_data_expert_system_prompt()}
            {get_mh_data_expert_modality_prompt(modality_source=modality_source)}
            {get_mh_data_expert_feature_prompt(feature_name=feature_name, feature_definition=feature_definition)}
            {get_mh_data_expert_task_prompt(fact_type="derived value", fact_definition=self.DEFINITION)}       
            {get_mh_data_expert_requirements_prompt()}
            {get_mh_eveness_prompt()}
        """.replace("\r", "").replace("\n\n", "\n")
