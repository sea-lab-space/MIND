
from typing import List
from pydantic import BaseModel

class NarratorOutputModel(BaseModel):
    insights: List[str]
