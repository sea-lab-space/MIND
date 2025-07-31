import type { DataSourceType } from "./props";

export interface InsightSpec {
  isSelectable: boolean;
  title: string;
}

export interface FactSpec {
  factStatement: string;
}

export type InsightType = 'comparison' | 'trend' | 'value'

export type DataPoint = {
  date: string;
  [metric: string]: string | number | null;
};

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
  fact_type: Extract<DataSourceType, "derived value">;
}

export interface ComparisonSpec {
  name: string;
  attribute: ComparisonDifferenceAttributes;
  aggregation: SpecAggregation;
  time_dur_1: TimeDuration;
  time_dur_2: TimeDuration;
  value_dur_1: number;
  value_dur_2: number;
  fact_description: string;
  fact_type: Extract<DataSourceType, "comparison">;
}

export interface DifferenceSpec {
  name: string;
  attribute: ComparisonDifferenceAttributes;
  time_1: string;
  time_2: string;
  value_1: number;
  value_2: number;
  fact_description: string;
  fact_type: Extract<DataSourceType, "difference">;
}

export interface ExtremeSpec {
  name: string;
  attribute: ExtremeAttributes;
  time: string;
  value: number;
  fact_description: string;
  fact_type: Extract<DataSourceType, "extreme">;
}

export interface TrendSpec {
  name: string;
  attribute: TrendAttributes;
  time_1: string;
  time_2: string;
  fact_description: string;
  fact_type: Extract<DataSourceType, "trend">;
}

export interface TextSourceSpec {
  fact_type: Extract<DataSourceType, "text">;
  date: string;
  text: string;
}

export type HighlightSpec = ValueSpec | ComparisonSpec | DifferenceSpec | ExtremeSpec | TrendSpec | TextSourceSpec;


// export const specMap = (spec: HighlightSpec) => {
//   if (spec.fact_type === "trend") return spec as TrendSpec;
//   else if (spec.fact_type === "extreme") return spec as ExtremeSpec;
//   else if (spec.fact_type === "difference") return spec as DifferenceSpec;
//   else if (spec.fact_type === "comparison") return spec as ComparisonSpec;
//   else if (spec.fact_type === "derived value") return spec as ValueSpec;
//   else if (spec.fact_type === "text") return spec as TextSourceSpec;
//   else throw new Error("Invalid spec type");
// };
