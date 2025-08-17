from discoverer.numeric_tab_data.base_agent import BaseDiscovererAgent
from utils.prompt_commons import OPENAI_AGENTIC_REC, OPENAI_AGENTIC_TOOL_USE
from MIND_types import (
    DiscovererOutput,
    FactTrendConfig
)

class TrendDiscovererAgent(BaseDiscovererAgent):
    DEFINITION = r"""
        Trend describes the general tendency of a feature over a specified time period, characterized as one of the following: rise, fall, stable, or cyclic. 
        Focus on longer term trends, specifically trend patterns that persist at least 3 days.
    """
    OUTPUT_MODEL = DiscovererOutput[FactTrendConfig]

    def _glue_instructions(self, modality_source, feature_name, feature_definition):
        from discoverer.numeric_tab_data.system_prompt import (
            get_mh_data_expert_modality_prompt,
            get_mh_data_expert_feature_prompt,
            get_mh_data_expert_system_prompt,
            get_mh_data_expert_task_prompt,
            get_mh_data_expert_requirements_prompt,
            get_mh_eveness_prompt
        )
        # {get_mh_data_date_prompt(retrospect_date_str=self.retrospect_date, before_date_str=self.before_date)}

        return f"""
            {OPENAI_AGENTIC_REC}
            {get_mh_data_expert_system_prompt()}
            {get_mh_data_expert_modality_prompt(modality_source=modality_source)}
            {get_mh_data_expert_feature_prompt(feature_name=feature_name, feature_definition=feature_definition)}
            {get_mh_data_expert_task_prompt(fact_type="trend", fact_definition=self.DEFINITION)}            
            {get_mh_data_expert_requirements_prompt()}
            {get_mh_eveness_prompt()}       
        """.replace("\r", "").replace("\n\n", "\n")
