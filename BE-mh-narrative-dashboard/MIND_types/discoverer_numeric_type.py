from typing import List, Literal, TypeVar, Generic
from pydantic import BaseModel, Field, model_validator

# --- 1. Generalized Literal Types ---
# All literal types are defined upfront for clarity and reusability.

AttributeChangeDirection = Literal['more', 'less']
AttributeAggregation = Literal['average', 'stdev', 'median', 'max', 'min']
AttributeExtreme = Literal['min', 'max']
AttributeTrend = Literal['rise', 'fall', 'stable', 'cyclic']


# --- Helper Models ---
class TimeDuration(BaseModel):
    """Represents a duration with a start and end time."""
    time_start: str = Field(...,
                            description="The start time of the period, in YYYY-MM-DD format.")
    time_end: str = Field(...,
                          description="The end time of the period, in YYYY-MM-DD format.")


# --- 2. Base Class for All Facts ---
class BaseFactConfig(BaseModel):
    """A base model for any data fact, containing common fields."""
    name: str = Field(..., description="Name of the feature being analyzed.")
    fact_type: str = Field(..., description="The type of the discovered fact.")
    fact_description: str = Field(
        "",  # This will be generated automatically by child models.
        description="A natural language description of the data fact."
    )


# --- 3. Templatized Fact Configurations ---
# Each fact model inherits from the base class and uses a validator
# to automatically generate its description.

class FactComparisonConfig(BaseFactConfig):
    """A fact comparing an aggregated value between two time periods."""
    fact_type: Literal['comparison'] = 'comparison'
    attribute: AttributeChangeDirection
    aggregation: AttributeAggregation
    time_dur_1: TimeDuration
    time_dur_2: TimeDuration
    value_dur_1: float
    value_dur_2: float

    @model_validator(mode='after')
    def generate_description(self) -> 'FactComparisonConfig':
        """Generates a templated description after model validation."""
        self.fact_description = (
            f"The {self.aggregation} {self.name} became {self.attribute} from {self.value_dur_1} "
            f"(period: {self.time_dur_1.time_start} to {self.time_dur_1.time_end}) to {self.value_dur_2} "
            f"(period: {self.time_dur_2.time_start} to {self.time_dur_2.time_end})."
        )
        return self


class FactDifferenceConfig(BaseFactConfig):
    """A fact describing the difference in value between two points in time."""
    fact_type: Literal['difference'] = 'difference'
    attribute: AttributeChangeDirection
    time_1: str
    time_2: str
    value_1: float
    value_2: float

    @model_validator(mode='after')
    def generate_description(self) -> 'FactDifferenceConfig':
        """Generates a templated description after model validation."""
        self.fact_description = (
            f"The {self.name} was {self.value_1} on {self.time_1} and "
            f"became {self.attribute} at {self.value_2} on {self.time_2}."
        )
        return self


class FactExtremeConfig(BaseFactConfig):
    """A fact describing a maximum or minimum value."""
    fact_type: Literal['extreme'] = 'extreme'
    attribute: AttributeExtreme
    time: str
    value: float

    @model_validator(mode='after')
    def generate_description(self) -> 'FactExtremeConfig':
        """Generates a templated description after model validation."""
        self.fact_description = (
            f"The {self.name} reached its {self.attribute} value of "
            f"{self.value} on {self.time}."
        )
        return self


class FactTrendConfig(BaseFactConfig):
    """A fact describing a trend over a period of time."""
    fact_type: Literal['trend'] = 'trend'
    attribute: AttributeTrend
    time_1: str
    time_2: str

    @model_validator(mode='after')
    def generate_description(self) -> 'FactTrendConfig':
        """Generates a templated description after model validation."""
        self.fact_description = (
            f"The {self.name} showed a {self.attribute} trend from "
            f"{self.time_1} to {self.time_2}."
        )
        return self


class FactDerivedValueConfig(BaseFactConfig):
    """A fact describing a single aggregated value over a time period."""
    fact_type: Literal['derived_value'] = 'derived_value'
    aggregation: AttributeAggregation
    time_1: str
    time_2: str
    value: float

    @model_validator(mode='after')
    def generate_description(self) -> 'FactDerivedValueConfig':
        """Generates a templated description after model validation."""
        # The original description seemed incorrect; this is a more logical template.
        self.fact_description = (
            f"The {self.aggregation} of {self.name} from {self.time_1} to "
            f"{self.time_2} was {self.value}."
        )
        return self


# --- 4. Generic Output Model ---
# A single, reusable output model using Python's generics.

FactType = TypeVar('FactType', bound=BaseFactConfig)


class DiscovererOutput(BaseModel, Generic[FactType]):
    """A generic container for a list of discovered facts."""
    facts: List[FactType]
