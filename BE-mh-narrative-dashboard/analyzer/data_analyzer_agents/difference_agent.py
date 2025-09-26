from analyzer.data_analyzer_agents.base_agent import BaseAnalyzerAgent
from utils.tools import agent_tool_validate_fact_value
from utils.prompt_commons import OPENAI_AGENTIC_REC, OPENAI_AGENTIC_TOOL_USE, OPENAI_AGENTIC_PLANNING
from MIND_types import (
    AnalyzerOutput,
    FactDifferenceConfig
)

class DifferenceAnalyzerAgent(BaseAnalyzerAgent):
    DEFINITION = r"""
        Difference captures how the value of a feature between two time points change in the data. 
        Only return differences between adjacent time points to capture sudden changes.
    """
    OUTPUT_MODEL = AnalyzerOutput[FactDifferenceConfig]
    TOOLS = [agent_tool_validate_fact_value]

    def _glue_instructions(self, modality_source, feature_name, feature_definition):
        from analyzer.data_analyzer_agents.system_prompt import (
            get_mh_data_expert_modality_prompt,
            get_mh_data_expert_feature_prompt,
            get_mh_data_expert_system_prompt,
            get_mh_data_expert_task_prompt,
            get_mh_data_expert_requirements_prompt
        )

        return f"""
            {OPENAI_AGENTIC_REC}
            {OPENAI_AGENTIC_TOOL_USE}
            {OPENAI_AGENTIC_PLANNING}
            {get_mh_data_expert_system_prompt()}
            {get_mh_data_expert_modality_prompt(modality_source=modality_source)}
            {get_mh_data_expert_feature_prompt(feature_name=feature_name, feature_definition=feature_definition)}
            {get_mh_data_expert_task_prompt(fact_type="difference", fact_definition=self.DEFINITION)}       
            {get_mh_data_expert_requirements_prompt()}
        """.replace("\r", "").replace("\n\n", "\n")
