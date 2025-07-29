export interface InsightSpec {
  isSelectable: boolean;
  title: string;
}

export interface FactSpec {
  factStatement: string;
}

export type InsightType = 'comparison' | 'trend' | 'value'

export interface DataPoint {
  x: Date;
  y: number;
}

export interface NumericalFact {
  query: string;
  data: any;
}

export interface TextFact {
  query: string;
  history: TextSimilarityMap[];
}

export interface TextSimilarityMap {
  fullText: string;
  date: Date;
  similarity: TextUnitMap[];
}

export interface TextUnitMap {
  token: string;
  score: number;
}

type TrendAttributes = "rise" | "fall" | "stable" | "cyclic";
type ComparisonDifferenceAttributes = "less" | "more";
type ExtremeAttributes = "min" | "max";

type SpecAttribute =
  | TrendAttributes
  | ComparisonDifferenceAttributes
  | ExtremeAttributes;

type SpecAggregation = 'average' | 'stdev' | 'median' | 'max' | 'min'

const factTypes = [
  "derived value",
  "comparison",
  "difference",
  "extreme",
  "trend",
] as const;

type SpecFactType = (typeof factTypes)[number];
export interface TimeDuration {
  time_start: string;
  time_end: string;
}
export interface ValueSpec {
  name: string;
  aggregation: SpecAggregation;
  time_1: string;
  time_2: string;
  value: number;
  fact_description: string;
  fact_type: Extract<SpecFactType, "derived value">;
}

export interface ComparisonSpec {
  name: string;
  attribute: ComparisonDifferenceAttributes;
  time_dur_1: TimeDuration;
  time_dur_2: TimeDuration;
  val_dur_1: number;
  val_dur_2: number;
  fact_description: string;
  fact_type: Extract<SpecFactType, "comparison">;
}

export interface DifferenceSpec {
  name: string;
  attribute: ComparisonDifferenceAttributes;
  time_1: string;
  time_2: string;
  value_1: number;
  value_2: number;
  fact_description: string;
  fact_type: Extract<SpecFactType, "difference">;
}

export interface ExtremeSpec {
  name: string;
  attribute: ExtremeAttributes;
  time: string;
  value: number;
  fact_description: string;
  fact_type: Extract<SpecFactType, "extreme">;
}

export interface TrendSpec {
  name: string;
  attribute: TrendAttributes;
  time_1: string;
  time_2: string;
  fact_description: string;
  fact_type: Extract<SpecFactType, "trend">;
}

export interface TextSourceSpec {
  fact_type: Extract<SpecFactType, "text">;
  date: string;
  text: string;
}

export type HighlightSpec = ValueSpec | ComparisonSpec | DifferenceSpec | ExtremeSpec | TrendSpec | TextSourceSpec;





