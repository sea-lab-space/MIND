
from typing import List
from pydantic import BaseModel, Field

class NarratorOutputModel(BaseModel):
    insights: List[str]

class InsightGuardrailOutputModel(BaseModel):
    insight: str = Field(..., description="The revised insight.")

class RewriterOutputModel(BaseModel):
    rewritten_data_fact: str = Field(..., description="The rewritten data fact.")

class QIAOutputModel(BaseModel):
    answer_text: str = Field(..., description="The answer to the question.")
