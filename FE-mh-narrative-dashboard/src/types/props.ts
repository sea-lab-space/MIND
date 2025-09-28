import { Heart, Brain, Activity, Pill, History } from "lucide-react";
import type { DataPoint, HighlightSpec } from "./insightSpec";

export const DatasourceIconTypes = {
  passiveSensing: "passive sensing",
  clinicalNotes: "clinical note",
  clinicalTranscripts: "session transcript",
  surveyScore: "survey"
} as const;

export type DatasourceIconType = typeof DatasourceIconTypes[keyof typeof DatasourceIconTypes];

export interface DatasourceIconProps {
  iconType: DatasourceIconType;
  showType?: boolean;
  forcePlainColor?: boolean;
  textPlainColor?: boolean;
}

export interface HeaderProps {
  isHomePage: boolean;
  patientNames: string[];
  userName: string;
  retrospectHorizon: RetrospectOptions;
  selectedPatient: string;
  setSelectedPatient: (patient: string) => void;
  disabled: boolean;
}


// TODO: support more granularities
export type RetrospectOptions = {
  [key: string]: number;
};

// TODO: replace any with icon type
export interface SectionProps {
  title: string;
  isExpanded: boolean;
  onClick: () => void;
  subtitle?: string;
  icon?: any;
  children?: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
  shouldExpand?: boolean;
}

export interface InsightExpandViewItem {
  key: string;
  summarySentence: string;
  dataPoints: Record<string, number>;
  source: string;
  highlightSpec?: HighlightSpec;
  dataSourceType: DataSourceType;
  insightType?: InsightType;
  isShowL2: boolean;
  spec?: any;
}

export interface InsightCardData {
  key: string;
  summaryTitle: string;
  sources: { type: DatasourceIconType }[];
  insightType: { type: InsightType }[];
  expandView: InsightExpandViewItem[];
  transcriptRelevance?: DataPoint[];
  noteRelevance?: DataPoint[];
}


export const overviewIconMap: Record<string, React.ElementType> = {
  heart: Heart,
  brain: Brain,
  activity: Activity,
  medication: Pill,
  history: History,
};

export const InsightType = {
  PSYCHOLOGICAL: "psychological",
  SOCIAL: "social",
  BIOLOGICAL: "biological",
} as const;


export type InsightType = typeof InsightType[keyof typeof InsightType];

export const DataSourceType = {
  TREND: "trend",
  EXTREME: "extreme",
  DIFFERENCE: "difference",
  COMPARISON: "comparison",
  TEXT: "text",
  DERIVED_VALUE: "derived value",
  RAW: "raw",
  OUTLIER: "outlier"
} as const;

export type DataSourceType = typeof DataSourceType[keyof typeof DataSourceType];


export const dateSectionMap = [
  {
    start: "2021-05-09", // single-day
    end: "2021-06-07",
    section: "insights",
  },
  {
    start: "2021-05-09", // range example
    end: "2021-05-09",
    section: "lastSession",
  },
  {
    start: "2021-07-01",
    end: "2021-07-01",
    section: "communication",
  },
];
