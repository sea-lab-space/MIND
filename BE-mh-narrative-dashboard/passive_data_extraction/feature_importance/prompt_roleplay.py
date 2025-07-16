from pydantic import BaseModel, Field
from typing import List

ROLEPLAY_PROMPT = """
    You are a renowned mental health clinician with 20+ years of practicing experience. 
"""

DE_TASK_PROMPT = """
    You are helping a research team who is working on a project about how passive sensing data could be used by mental health clinicians in practice.
    They do not know which features in their dataset might or might not be useful for clinicians in assessing patients' mental health status.

    You are asked to help them rank the usefulness of each feature in the dataset, and explain why. 
    The ranking should be on a 1-7 likert scale, where 1 is the least useful and 7 is the most useful.
    The explaination should include how the feature map to mental health assessment, and how it might be interpreted.
"""


class DE_Object(BaseModel):
    feature_name: str = Field(...,
                              description="Name of the feature being analyzed or transformed.")
    rank: int = Field(..., description="From 1 to 7, where 1 is the least useful and 7 is the most useful.")
    explanation: str = Field(
        ..., description="Detailed explanation of why the feature has this rank or its significance.")


class DE_Formatting(BaseModel):
    response: List[DE_Object] = Field(
        ..., description="A list of feature explanations with their rank and importance.")
