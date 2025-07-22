import { Heart, Brain, Activity, Pill, History } from "lucide-react";

export const DatasourceIconTypes = {
  passiveSensing: 'passive sensing',
  clinicalNotes: 'notes',
  clinicalTranscripts: 'transcripts',
  measurementScore: 'measurement score'
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
}

export interface InsightCardData {
  key: string;
  summaryTitle: string;
  sources: { type: DatasourceIconType }[];
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


export enum InsightType {
  SLEEP = "sleep",
  ACTIVITY = "activity",
  DIGITAL = "digital",
  EMOTIONAL = "emotional",
  SOCIAL = "social",
  MEDICATION = "medication"
}

export enum DataSourceType {
  TREND = "trend",
  EXTREME = "extreme",
  DIFFERENCE = "difference",
  COMPARISON = "comparison",
}