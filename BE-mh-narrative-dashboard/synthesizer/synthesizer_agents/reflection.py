from pydantic import BaseModel, Field
from agents import Agent, ModelSettings, Runner
from typing import List, Literal
from datetime import datetime
import sys
from pathlib import Path
from dotenv import load_dotenv
from synthesizer.synthesizer_commons import SYNT_CATEGORIZATION_PROMPT, SYNT_CATEGORY_PROMPT, SYNT_DATA_PROMPT, SYNT_RULES, SYNT_EXAMPLES
from utils.prompt_commons import OPENAI_AGENTIC_REC, OPENAI_AGENTIC_TOOL_USE, OPENAI_AGENTIC_PLANNING, get_mh_data_expert_system_prompt
from utils.tools import retrive_data_facts

project_root = Path(__file__).parent.parent.parent
print(project_root)
sys.path.append(str(project_root))
load_dotenv()


SYNT_CRITIQIUE_DATA_PROMPT = """
You are provided with a list of data insights in the following format:
{
    "insight_description": str,
    "insight_source": List[str],      # Format: [modality]-[source]-[id]
    "insight_category": List[str],    # Insight categories
}
Where:
- `modality` can be: 
    - `sv` (survey)
    - `ps` (passive sensing)
- `insight_source` refers to supporting fact IDs from different modalities.
"""

SYNT_CRITIQUE_PROMPT = f"""
You are a reflective clinical insight generation assistant.
Previously, you generated a set of data-driven insights based on a multi-modal mental health dataset.

You are now provided with:
1. All available data facts
2. The previously generated insights
3. Overall data coverage
4. Your past self-reflections

---

Your objectives are to:
* **Diagnose** the quality of your prior insights
* **Reflect** on what worked and what didn’t
* **Plan** concrete improvements for the next iteration

Use these guiding questions in your reflection:
- Does each insight belong to exactly one `insight_category`?
- Are any insights redundant or overlapping?
- Did you miss important signals from unused data facts?
- How well do your insights support clinical understanding or decision-making?

{SYNT_CATEGORIZATION_PROMPT}
{SYNT_DATA_PROMPT}

---

In your response, follow these steps:

### Step 1: Critique
Critically assess strengths and weaknesses of the generated insights.

### Step 2: Reflection
Summarize key learnings from this critique. What could you improve next time?

### Step 3: Forward Projection
Propose improvements for the next generation of insights:
- Which types of data facts should be included?
- Which insight categories should be better covered?

Focus on generating **meaningful, clinically relevant, and actionable insights**.

Let's think step by step.
"""
#     "entropy": float                  # Diversity of data source types
# Do not blindly maximize entropy or include too much.
# - Did you over-rely on any one modality (e.g., only survey or only transcript)?
# - How would you better balance the use of different modalities?


def get_reflection_prompt(data_facts: str, insights: str, coverage: float, reflection_history: str) -> str:
    return f"""
        |data facts|:
        {data_facts}
        
        |generated insights|:
        {insights}

        |coverage|: {coverage:.2f}

        |self-reflection history|:
        {reflection_history}

        Please format your response as:
        Critique:
        ...

        Reflection:
        ...

        Forward Projection:
        ...
        """.strip()

class InsightReflectionOutputModel(BaseModel):
    reflection: str

class InsightReflectionAgent:
    def __init__(self, model: str):
        self.agent = Agent(
            name=f"Insight reflection agent",
            model_settings=ModelSettings(temperature=0.2, top_p=0.1),
            model=model,
            output_type=InsightReflectionOutputModel,
        )

    def _glue_instructions(self):
        return f"""
            {OPENAI_AGENTIC_REC}
            {get_mh_data_expert_system_prompt()}
            {SYNT_CRITIQUE_PROMPT}
            {SYNT_CRITIQIUE_DATA_PROMPT}
            {SYNT_RULES}
            {SYNT_EXAMPLES}
        """

    async def run(self, data_facts, data_insights, coverage, history, verbose: bool = False):
        self.agent.instructions = self._glue_instructions()
        
        res = await Runner.run(self.agent, get_reflection_prompt(
            data_facts,
            data_insights,
            coverage,
            history
        ))

        res_dict = res.final_output.model_dump()
        if verbose:
            print(res_dict.get("reflection"))
        return res_dict.get("reflection") or ""
