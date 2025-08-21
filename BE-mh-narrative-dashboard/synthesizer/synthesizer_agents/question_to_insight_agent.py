import asyncio
from synthesizer.synthesizer_commons import SYNT_CATEGORIZATION_PROMPT
from utils.prompt_commons import (
    OPENAI_AGENTIC_REC,
    get_mh_data_expert_system_prompt,
)
from agents import Agent, ModelSettings, Runner
from MIND_types.synthesizer_type import (
    InsightProposalOutputModel
)

Q2I_INSTRUCTION = f"""
{OPENAI_AGENTIC_REC}
{get_mh_data_expert_system_prompt()}

You are a clinical summarization assistant preparing for today’s patient encounter.

You will recieve two inputs:
- Clinical question
- Data facts (from patient-generated data)
    Quantifiers: "slightly, stable" = **not significant**; "modest, increasing, decreasing, cyclic" = **significant**

{SYNT_CATEGORIZATION_PROMPT}
    
Your task is to Synthesize the data facts with the question to produce **one concise clinical takeaway**.

Rules:
1. Output one sentence, ≤15 words (aim for 8-13).  
2. Use clear, plain language and present tense; no preamble, reasoning, or suggestion.  
3. Prioritize significant trends relevant to the question; mention "stable" only if nothing significant applies.  
4. If the question is about medication, state the insight and append: `may link to <medication name> use`.  
5. Give one insight per question.

Optimization: If no significant signals, choose at most 6 (aim for 3) data facts that are:
a) most clinically relevant to the question;
b) has the biggest change;
c) diverse in fact type and data modality.
"""


class Q2IAgent:

    OUTPUT_MODEL = InsightProposalOutputModel

    def __init__(self, model: str):
        self.model = model
        self.agent = Agent(
            name=f"Question to Insight Agent",
            model_settings=ModelSettings(temperature=0.0),
            model=model,
            instructions=Q2I_INSTRUCTION,
            output_type=self.OUTPUT_MODEL,
        )

    def _glue_data_facts(self, data_facts):
        # use significant results first
        included_list = []
        for data_fact in data_facts:
            if data_fact['fact_type'] == "comparison":
                if data_fact['significance'] == 'indicative':
                    included_list.append(data_fact)
            elif data_fact['fact_type'] == "trend":
                if data_fact["attribute"] in ["rise", "fall", "cyclic", "stable", "variable"]:
                    included_list.append(data_fact)
            elif data_fact['fact_type'] == "outlier":
                included_list.append(data_fact)
        
        # fallback condition
        if len(included_list) < 2:
            print("No significant result found")
            included_list = data_facts
            
        # print(included_list)
        
        prompt_list = [f"[{fact['id']}] {fact['fact_description']}" for fact in included_list]
        evidence_str = "\n".join(prompt_list)

        prompt_input = f"""
            Data facts
            ```
            {evidence_str}
            ```
        """
        return prompt_input

    async def _async_run(self, data_facts, verbose: bool = False):
        data_fact_list = self._glue_data_facts(data_facts)
        # if verbose:
        #     print(data_fact_list)
        res = await Runner.run(self.agent, data_fact_list)
        res_dict = res.final_output.model_dump()
        if verbose:
            print(res_dict.get("insights"))
        return res_dict.get("insights") or res_dict

    def run(self, data_facts, verbose: bool = False):
        return asyncio.run(self._async_run(data_facts, verbose))
