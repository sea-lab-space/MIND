from typing import List, Literal
from pydantic import BaseModel, Field

LiteralChangeDirection = Literal['more', 'less']
LiteralAggregation = Literal['average', 'stdev', 'median', 'max', 'min']

class TimeDuration(BaseModel):
    time_start: str = Field(...,
                            description="The start time of the period, in YYYY-MM-DD format.")
    time_end: str = Field(...,
                          description="The end time of the period, in YYYY-MM-DD format.")


# -- Comparison --
# Rationale: This is a compount fact (a generalized case for difference): there is no meaning comparing two individual values in mh.
class FactComparisonConfig(BaseModel):
    name: str = Field(...,
                      description="Name of the feature being analyzed or transformed.")
    attribute: LiteralChangeDirection = Field(
        ..., description="The attribute of the feature, more or less."
    )
    aggregation: LiteralAggregation = Field(
        ..., description="The aggregation method of the feature, one of average, stdev, median, max, and min."
    )
    time_dur_1: TimeDuration = Field(
        ..., description="The base time period of comparison, in YYYY-MM-DD format."
    )
    time_dur_2: TimeDuration = Field(
        ..., description="The second time period of comparison, in YYYY-MM-DD format."
    )
    value_dur_1: float = Field(...,
                               description="The [attribute] of the feature in time_dur_1.")
    value_dur_2: float = Field(...,
                               description="The [attribute] of the feature in time_dur_2.")
    fact_description: str = Field(
        ..., description="The [aggregation] [name] became [attribute] from [value_dur_1] in [time_dur_1] to [value_dur_2] in [time_dur_2]."
    )
    fact_type: Literal['comparison']


class ComparisonDiscovererOutput(BaseModel):
    facts: List[FactComparisonConfig]

# -- Difference --
class FactDifferenceConfig(BaseModel):
    name: str = Field(...,
                      description="Name of the feature being analyzed or transformed.")
    attribute: LiteralChangeDirection = Field(
        ..., description="The attribute of the feature, more or less."
    )
    time_1: str = Field(...,
                        description="The first timepoint, in YYYY-MM-DD format.")
    time_2: str = Field(...,
                        description="The second timepoint, in YYYY-MM-DD format.")
    value_1: float = Field(...,
                           description="The value of the feature at time_1.")
    value_2: float = Field(...,
                           description="The value of the feature at time_2.")
    fact_description: str = Field(
        ..., description="The [name] was [value_1] on [time_1] and became [attribute] at [value_2] on [time_2]."
    )
    fact_type: Literal['difference']


class DifferenceDiscovererOutput(BaseModel):
    facts: List[FactDifferenceConfig]


# -- Extreme --
class FactExtremeConfig(BaseModel):
    # fact_description: The natural language description of the data fact
    # The [attribute] of [name] is [value] at [time].
    name: str = Field(...,
                      description="Name of the feature being analyzed or transformed.")
    attribute: Literal['min', 'max'] = Field(
        ..., description="The attribute of the feature, max or min.")
    time: str = Field(...,
                      description="The time of the feature, in YYYY-MM-DD format.")
    value: float = Field(..., description="The numeric value of the feature.")
    fact_description: str = Field(
        ..., description="The [name] reached its [attribute] value of [value] on [time].")
    fact_type: Literal['extreme']


class ExtremeDiscovererOutput(BaseModel):
    facts: List[FactExtremeConfig]

# -- Trend --
class FactTrendConfig(BaseModel):
    # fact_description: The natural language description of the data fact
    # The [attribute] of [name] is [value] at [time].
    name: str = Field(...,
                      description="Name of the feature being analyzed or transformed.")
    attribute: Literal['rise', 'fall', 'stable', 'cyclic'] = Field(
        ..., description="The attribute of the feature, one of rise, fall, stable, and cyclic.")
    time_1: str = Field(...,
                        description="The start time of trend, in YYYY-MM-DD format.")
    time_2: str = Field(...,
                        description="The end time of trend, in YYYY-MM-DD format.")
    fact_description: str = Field(
        ..., description="[The] [name] showed a [attribute] trend from [time_1] to [time_2].")
    fact_type: Literal['trend']


class TrendDiscovererOutput(BaseModel):
    facts: List[FactTrendConfig]


# -- Derived Value --
class FactDerivedValueConfig(BaseModel):
    name: str = Field(...,
                      description="Name of the feature being analyzed or transformed.")
    aggregation: Literal['average', 'stdev', 'median', 'max', 'min'] = Field(
        ..., description="The aggregation method of the feature, one of average, stdev, median, max, and min."
    )
    time_1: str = Field(...,
                        description="The first timepoint, in YYYY-MM-DD format.")
    time_2: str = Field(...,
                        description="The second timepoint, in YYYY-MM-DD format.")
    value: float = Field(..., description="The numeric value of the feature.")
    fact_description: str = Field(
        ..., description="The [aggregation] [name] became [attribute] from [value_dur_1] in [time_dur_1] to [value_dur_2] in [time_dur_2]."
    )
    fact_type: Literal['derived value']


class DerivedValueDiscovererOutput(BaseModel):
    facts: List[FactDerivedValueConfig]
