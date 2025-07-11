import type { HTMLAttributes } from "react";

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
}