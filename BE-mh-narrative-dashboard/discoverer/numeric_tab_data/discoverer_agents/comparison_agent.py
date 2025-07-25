from pydantic import BaseModel, Field
from typing import List, Literal
from discoverer.numeric_tab_data.discoverer_agents.base_agent import BaseDiscovererAgent
from utils.prompt_commons import OPENAI_AGENTIC_REC, OPENAI_AGENTIC_TOOL_USE, OPENAI_AGENTIC_PLANNING
from utils.tools import (
    agent_tool_calculate_average,
    agent_tool_calculate_max,
    agent_tool_calculate_median,
    agent_tool_calculate_min,
    agent_tool_calculate_stdev,
)

class TimeDuration(BaseModel):
    time_start: str = Field(...,
                            description="The start time of the period, in YYYY-MM-DD format.")
    time_end: str = Field(...,
                          description="The end time of the period, in YYYY-MM-DD format.")

# Rationale: This is a compount fact (a generalized case for difference): there is no meaning comparing two individual values in mh.
class FactComparisonConfig(BaseModel):
    name: str = Field(...,
                      description="Name of the feature being analyzed or transformed.")
    attribute: Literal['more', 'less'] = Field(
        ..., description="The attribute of the feature, more or less."
    )
    aggregation: Literal['average', 'stdev', 'median', 'max', 'min'] = Field(
        ..., description="The aggregation method of the feature, one of average, stdev, median, max, and min."
    )
    time_dur_1: TimeDuration = Field(
        ..., description="The base time period of comparison, in YYYY-MM-DD format."
    )
    time_dur_2: TimeDuration = Field(
        ..., description="The second time period of comparison, in YYYY-MM-DD format."
    )
    value_dur_1: float = Field(..., description="The [attribute] of the feature in time_dur_1.")
    value_dur_2: float = Field(..., description="The [attribute] of the feature in time_dur_2.")
    fact_description: str = Field(
        ..., description="The [aggregation] [name] became [attribute] from [value_dur_1] in [time_dur_1] to [value_dur_2] in [time_dur_2]."
    )
    fact_type: Literal['comparison']


class ComparisonDiscovererOutput(BaseModel):
    facts: List[FactComparisonConfig]

class ComparisonDiscovererAgent(BaseDiscovererAgent):
    DEFINITION = r"""
        Comparison describes how an aggregated value of a feature changes between two time periods (time_dur_1 and time_dur_2). Supported aggregation methods include average, standard deviation (stdev), median, maximum (max), and minimum (min). The fact indicates whether the feature became more or less prominent over time based on the selected aggregation.
    """
    OUTPUT_MODEL = ComparisonDiscovererOutput
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
            {get_mh_data_expert_task_prompt(fact_type="comparison", fact_definition=self.DEFINITION)}       
            {get_mh_data_expert_requirements_prompt()}
            {get_mh_eveness_prompt()}
        """.replace("\r", "").replace("\n\n", "\n")
