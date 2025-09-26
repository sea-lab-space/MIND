from analyzer.data_analyzer_agents.base_agent import BaseAnalyzerAgent
from utils.tools import (
    agent_tool_calculate_average,
    agent_tool_calculate_max,
    agent_tool_calculate_median,
    agent_tool_calculate_min,
    agent_tool_calculate_stdev,
)
from utils.prompt_commons import OPENAI_AGENTIC_REC, OPENAI_AGENTIC_TOOL_USE, OPENAI_AGENTIC_PLANNING
from MIND_types import (
    AnalyzerOutput,
    FactDerivedValueConfig
)

class DerivedValueAnalyzerAgent(BaseAnalyzerAgent):
    DEFINITION = r"""
        Derived value is a value calculated from a set of data points based on a specific aggregation.
    """
    OUTPUT_MODEL = AnalyzerOutput[FactDerivedValueConfig]
    TOOLS = [
        agent_tool_calculate_average,
        agent_tool_calculate_max,
        agent_tool_calculate_median,
        agent_tool_calculate_min,
        agent_tool_calculate_stdev,
    ]

    def _glue_instructions(self, modality_source, feature_name, feature_definition):
        from analyzer.data_analyzer_agents.system_prompt import (
            get_mh_data_expert_modality_prompt,
            get_mh_data_expert_feature_prompt,
            get_mh_data_expert_system_prompt,
            get_mh_data_expert_task_prompt,
            get_mh_data_expert_requirements_prompt,
            get_mh_eveness_prompt
        )

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
