from typing import List
from pydantic import BaseModel, Field

class TranscriptSpec(BaseModel):
    clinician: str = Field(..., description="Clinician speaking")
    patient: str = Field(..., description="Patient speaking")

class TranscriptResponse(BaseModel):
    response: List[TranscriptSpec] = Field(..., description="Transcript")
