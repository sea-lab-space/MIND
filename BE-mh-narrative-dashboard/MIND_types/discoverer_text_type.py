from typing import List
from pydantic import BaseModel, Field

class TextEvidence(BaseModel):
    date: str = Field(..., description="The date of the evidence, in YYYY-MM-DD format.")
    text: str = Field(..., description="The text of the evidence.")

class TextFact(BaseModel):
    fact_text: str
    evidence: List[TextEvidence]

class TextDataDiscoveryOutputModel(BaseModel):
    facts: List[TextFact]
