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






