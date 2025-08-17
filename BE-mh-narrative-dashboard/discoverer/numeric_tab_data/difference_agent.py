from discoverer.numeric_tab_data.base_agent import BaseDiscovererAgent
from utils.tools import agent_tool_validate_fact_value
from utils.prompt_commons import OPENAI_AGENTIC_REC, OPENAI_AGENTIC_TOOL_USE, OPENAI_AGENTIC_PLANNING
from MIND_types import (
    DiscovererOutput,
    FactDifferenceConfig
)


class DifferenceDiscovererAgent(BaseDiscovererAgent):
    DEFINITION = r"""
        Difference captures how the value of a feature between two time points change in the data.
    """
    OUTPUT_MODEL = DiscovererOutput[FactDifferenceConfig]
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
            {OPENAI_AGENTIC_REC}
            {OPENAI_AGENTIC_TOOL_USE}
            {OPENAI_AGENTIC_PLANNING}
            {get_mh_data_expert_system_prompt()}
            {get_mh_data_expert_modality_prompt(modality_source=modality_source)}
            {get_mh_data_expert_feature_prompt(feature_name=feature_name, feature_definition=feature_definition)}
            {get_mh_data_expert_task_prompt(fact_type="difference", fact_definition=self.DEFINITION)}       
            {get_mh_data_expert_requirements_prompt()}
            {get_mh_eveness_prompt()}
        """.replace("\r", "").replace("\n\n", "\n")
