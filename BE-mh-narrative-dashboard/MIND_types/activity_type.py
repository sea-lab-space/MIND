from typing import List
from pydantic import BaseModel, Field

class ActivitySpec(BaseModel):
    name: str = Field(..., description="The name of the activity.")
    description: str = Field(..., description="The description of the activity in plain text.")

class ActivityResponse(BaseModel):
    response: List[ActivitySpec]
