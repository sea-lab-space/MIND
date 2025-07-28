import { Heart, Brain, Activity, Pill, History } from "lucide-react";

export const DatasourceIconTypes = {
  passiveSensing: "passive sensing",
  clinicalNotes: "clinical note",
  clinicalTranscripts: "session transcript",
  measurementScore: "survey"
} as const;

export type DatasourceIconType = typeof DatasourceIconTypes[keyof typeof DatasourceIconTypes];

export interface DatasourceIconProps {
  iconType: DatasourceIconType;
  showType?: boolean;
}

export interface HeaderProps {
  patientNames: string[];
  userName: string;
  retrospectHorizon: RetrospectOptions 
}


// TODO: support more granularities
// Now the value should be the number of days
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
}

export interface InsightExpandViewItem {
  summarySentence: string;
  dataPoints: Record<string, number>;
  sources: { type: DatasourceIconType }[];
  dataSourceType: DataSourceType;
}

export interface InsightCardData {
  key: string;
  summaryTitle: string;
  sources: { type: DatasourceIconType }[];
  insightType: { type: InsightType }[];
  expandView: InsightExpandViewItem[];
}


export const iconMap: Record<string, React.ElementType> = {
  heart: Heart,
  brain: Brain,
  activity: Activity,
  medication: Pill,
  history: History,

  // Add more mappings as needed
};

export const InsightType = {
  SLEEP: "Sleep Patterns",
  ACTIVITY: "Physical Activity",
  DIGITAL: "Digital Engagement",
  EMOTIONAL: "Emotional State",
  SOCIAL: "Social Interaction",
  MEDICATION: "Medication & Treatment",
} as const;

export type InsightType = typeof InsightType[keyof typeof InsightType];

export const DataSourceType = {
  TREND: "trend",
  EXTREME: "extreme",
  DIFFERENCE: "difference",
  COMPARISON: "comparison",
  TEXT: "text",
  DERIVED_VALUE: "derived value"
} as const;

export type DataSourceType = typeof DataSourceType[keyof typeof DataSourceType];