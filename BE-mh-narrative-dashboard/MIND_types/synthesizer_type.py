from typing import List
from pydantic import BaseModel, Field


class InsightSpec(BaseModel):
    insight_description: str = Field(
        ..., description="The description of the insight, in 15 words")
    insight_source: List[str] = Field(...,
                                      description="The |fact-id|s that derives this insight")
    insight_category: List[str] = Field(
        ..., description="The |category| of the insight")


class InsightProposalOutputModel(BaseModel):
    insights: List[InsightSpec]
