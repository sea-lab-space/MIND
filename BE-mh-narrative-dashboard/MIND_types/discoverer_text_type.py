from typing import List, Literal
from pydantic import BaseModel, Field

LiteralTextModality = Literal["session transcript", "clinical note"]

class QuestionSource(BaseModel):
    source: LiteralTextModality
    text: str = Field(..., description="The text of the evidence.")


class TextQuestion(BaseModel):
    question: str
    action: str = Field(..., description="A 15-word or less description of what the question is asking.")
    evidence: List[QuestionSource] = Field(..., description="The text prompted the proposed question.")

class TextQuestionOutputModel(BaseModel):
    facts: List[TextQuestion]


class TextEvidence(BaseModel):
    date: str = Field(..., description="The date of the evidence, in YYYY-MM-DD format.")
    text: str = Field(..., description="The text of the evidence.")

class TextFact(BaseModel):
    fact_text: str
    evidence: List[TextEvidence] 

class TextDataDiscoveryOutputModel(BaseModel):
    facts: List[TextFact]
