from analyzer.data_analyzer_agents.base_agent import BaseAnalyzerAgent
from utils.prompt_commons import OPENAI_AGENTIC_REC, OPENAI_AGENTIC_TOOL_USE
from MIND_types import (
    AnalyzerOutput,
    FactTrendConfig
)

class TrendAnalyzerAgent(BaseAnalyzerAgent):
    DEFINITION = r"""
        Trend describes the general tendency of a feature over a specified time period, characterized as one of the following: rise, fall, stable, cyclic or no trend. 
    """
    OUTPUT_MODEL = AnalyzerOutput[FactTrendConfig]

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
            {get_mh_data_expert_system_prompt()}
            {get_mh_data_expert_modality_prompt(modality_source=modality_source)}
            {get_mh_data_expert_feature_prompt(feature_name=feature_name, feature_definition=feature_definition)}
            {get_mh_data_expert_task_prompt(fact_type="trend", fact_definition=self.DEFINITION)}            
            {get_mh_data_expert_requirements_prompt()}
            {get_mh_eveness_prompt()}       
        """.replace("\r", "").replace("\n\n", "\n")
