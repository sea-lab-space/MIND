from typing import List
from pydantic import BaseModel, Field

class MedicationSpec(BaseModel):
    date: str = Field(..., description="The date when the medication was prescribed, in YYYY-MM-DD format.")
    medication: str = Field(..., description="The name of the medication.")
    dosage: str = Field(..., description="The dosage of the medication.")
    frequency: str = Field(..., description="The frequency of the medication.")


class MedicationResponse(BaseModel):
    response: List[MedicationSpec]
