from typing import List, Literal, TypeVar, Generic, Union
from pydantic import BaseModel, Field, model_validator

# --- 1. Generalized Literal Types ---
# All literal types are defined upfront for clarity and reusability.

AttributeChangeDirection = Literal['more', 'less', 'even']
AttributeAggregation = Literal['average', 'stdev', 'median', 'max', 'min']
AttributeExtreme = Literal['min', 'max']
AttributeTrend = Literal['rise', 'fall', 'stable', 'cyclic', 'variable', 'no trend']
AttributeOutlier = Literal['spike', 'dip']

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

class FactOutlierConfig(BaseFactConfig):
    """A fact indicating an outlier in a feature."""
    fact_type: Literal['outlier'] = 'outlier'
    attribute: AttributeOutlier = Field(
        ..., description="The outlier attribute of the feature, one of spike or dip."
    )
    # value: float = Field(..., description="The outlier value of the feature.")
    time: str = Field(...,
                      description="The time of the feature, in YYYY-MM-DD format.")
    value: float = Field(..., description="The numeric value of the feature.")

    @model_validator(mode='after')
    def generate_description(self) -> 'FactOutlierConfig':
        """Generates a human-readable description after model validation."""
        if self.attribute.lower() == 'spike':
            action = f"spiked to {self.value}"
        elif self.attribute.lower() == 'dip':
            action = f"dipped to {self.value}"
        else:
            action = f"reached {self.value}"

        self.fact_description = (
            f"An anomaly was detected for {self.name} on {self.time}, which {action}."
        )
        return self


class FactComparisonConfig(BaseFactConfig):
    """A fact comparing an aggregated value between two time periods."""
    fact_type: Literal['comparison'] = 'comparison'
    attribute: AttributeChangeDirection = Field(
        ..., description="The aggregation method of the feature, one of average, stdev, median, max, and min."
    )
    aggregation: AttributeAggregation = Field(
        ..., description="The aggregation method of the feature, one of average, stdev, median, max, and min."
    )
    time_dur_1: TimeDuration = Field(
        ..., description="The first time period of comparison, in YYYY-MM-DD format."
    )
    time_dur_2: TimeDuration = Field(
        ..., description="The second time period of comparison, in YYYY-MM-DD format."
    )
    value_dur_1: float = Field(...,
                               description="The [attribute] of the feature in time_dur_1.")
    value_dur_2: float = Field(...,
                               description="The [attribute] of the feature in time_dur_2.")
    significance: Literal['insignificant', 'indicative']


    @model_validator(mode='after')
    def generate_description(self) -> 'FactComparisonConfig':
        """Generates a human-readable description after model validation."""

        # Determine direction
        direction_word = {
            'more': 'increase',
            'less': 'decrease',
            'even': 'remained stable'
        }.get(self.attribute, 'changed')

        # Determine magnitude only if the change is not 'even'
        if self.attribute in ['more', 'less']:
            magnitude_word = "modest" if self.significance == 'indicative' else "slight"
            self.fact_description = (
                f"The {self.aggregation} {self.name} showed a {magnitude_word} {direction_word} "
                f"from {self.value_dur_1} (period: {self.time_dur_1.time_start} to {self.time_dur_1.time_end}) "
                f"to {self.value_dur_2} (period: {self.time_dur_2.time_start} to {self.time_dur_2.time_end})."
            )
        else:
            # For 'even', no magnitude word needed
            self.fact_description = (
                f"The {self.aggregation} {self.name} {direction_word} "
                f"from {self.value_dur_1} (period: {self.time_dur_1.time_start} to {self.time_dur_1.time_end}) "
                f"to {self.value_dur_2} (period: {self.time_dur_2.time_start} to {self.time_dur_2.time_end})."
            )

        return self




class FactDifferenceConfig(BaseFactConfig):
    """A fact describing the difference in value between two points in time."""
    fact_type: Literal['difference'] = 'difference'
    attribute: AttributeChangeDirection = Field(
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
    attribute: AttributeExtreme = Field(
        ..., description="The attribute of the feature, max or min.")
    time: str = Field(...,
                      description="The time of the feature, in YYYY-MM-DD format.")
    value: float = Field(..., description="The numeric value of the feature.")

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
    attribute: AttributeTrend = Field(
        ..., description="The attribute of the feature, one of rise, fall, stable, and cyclic.")
    time_1: str = Field(...,
                        description="The start time of trend, in YYYY-MM-DD format.")
    time_2: str = Field(...,
                        description="The end time of trend, in YYYY-MM-DD format.")

    @model_validator(mode='after')
    def generate_description(self) -> 'FactTrendConfig':
        """Generates a templated description after model validation."""
        # Handle special wording for 'no trend' and 'variable'
        if self.attribute == 'no trend':
            trend_text = "no observable trend"
        elif self.attribute == 'variable':
            trend_text = "relatively high variability"
        elif self.attribute == 'rise':
            trend_text = "increasing trend"
        elif self.attribute == 'fall':
            trend_text = "decreasing trend"
        elif self.attribute == 'stable':
            trend_text = "stable trend"
        else:
            trend_text = f"{self.attribute} trend"

        self.fact_description = (
            f"The {self.name} showed {trend_text} from "
            f"{self.time_1} to {self.time_2}."
        )
        return self


class FactDerivedValueConfig(BaseFactConfig):
    """A fact describing a single aggregated value over a time period."""
    fact_type: Literal['derived_value'] = 'derived_value'
    aggregation: AttributeAggregation = Field(
        ..., description="The aggregation method of the feature, one of average, stdev, median, max, and min."
    )
    time_1: str = Field(...,
                        description="The first timepoint, in YYYY-MM-DD format.")
    time_2: str = Field(...,
                        description="The second timepoint, in YYYY-MM-DD format.")
    value: float = Field(..., description="The numeric value of the feature.")

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


class AnalyzerOutput(BaseModel, Generic[FactType]):
    """A generic container for a list of discovered facts."""
    facts: List[FactType]


AllFactConfigs = Union[
    FactComparisonConfig,
    FactDifferenceConfig,
    FactExtremeConfig,
    FactTrendConfig,
    FactDerivedValueConfig,
]

class AnalyzerQAOutput(BaseModel):
    facts: List[AllFactConfigs]

class AnalyzerPlannerSpec(BaseModel):
    is_computable: bool
    question_text: str
    features: List[str] = Field(..., description="The feature name to explore.")

class AnalyzerPlannerOutput(BaseModel):
    hooks: AnalyzerPlannerSpec
