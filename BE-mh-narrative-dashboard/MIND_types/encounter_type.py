from typing import List, Literal
from pydantic import BaseModel, Field

class EncounterSpec(BaseModel):
    date: str = Field(...,
                      description="The date of the encounter, in YYYY-MM-DD format.")
    type: Literal['Hospital Encounter', 'Office Visit'] = Field(
        ..., description="The type of encounter, one of 'Office Visit' or 'Hospital Encounter'.")
    medical_condition: str = Field(...,
                                   description="The medical condition being treated.")
    ICD_10_CM: str = Field(...,
                           description="The ICD-10-CM code for the medical condition.")
    CPT_code: str = Field(..., description="The CPT code for the encounter.")
    notes: str = Field(..., description="Progress note about the encounter.")


class EncounterResponse(BaseModel):
    response: List[EncounterSpec]
