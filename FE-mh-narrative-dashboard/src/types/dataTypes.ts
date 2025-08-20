// Datasource types for icons
import type {InsightType, InsightExpandViewItem } from "@/types/props";
import {
    BedDouble,
    Activity,
    PhoneCall,
    Brain,
    Users2,
    Pill,
} from "lucide-react"
import {type ReactNode} from "react";


export const DatasourceIconTypes = {
  surveyScore: "surveyScore",
  clinicalNotes: "clinicalNotes",
  clinicalTranscripts: "clinicalTranscripts",
  passiveSensing: "passiveSensing",
} as const;

export type DatasourceIconTypes =
  (typeof DatasourceIconTypes)[keyof typeof DatasourceIconTypes];

export type RetrospectOptions = {
    [label: string]: number; // e.g., "Last 3 months": 90
};

// ChartReview info
export interface BasicInfoCard {
    name: string;
    age: number;
    race: string;
    income: number;
    relationship: string;
}

// ChartReview section card
export interface OverviewInfoCard {
    icon: string;
    overviewHeadTitle: string;
    cardContent: {
        expanded: string;
        folded: string;
    };
}

// Patient communication suggestions
export interface SuggestedActivity {
    header: string;
    description: string;
}

export type TranscriptEntry = {
  clinician: string;
  patient: string;
};

export type MedicationEntry = {
    date: string;
    medication: string;
    dosage: string;
    frequency: string;
};

export type Encounter = {
    encounter_id: number;
    transcript: TranscriptEntry[];
    medication: MedicationEntry[];
    clinical_note: string;
    encounter_date: string;
};

export const InsightTypeIconMap: Record<InsightType, React.ElementType> = {
    "biological": Activity,
    "psychological": Brain,
    "social": Users2,
};

export interface SuggestedActivity {
    name: string;
    description: string;
}

export type TabKey =
  | "chart-review"
  | "survey-scores"
  | "passive-sensing"
  | "transcripts"
  | "clinical-notes";

export type HomePageTabKey =
    | "mind"
    | "survey-scores"
    | "passive-sensing"
    | "transcripts"
    | "clinical-notes";

export type TabItem = {
  key: TabKey | HomePageTabKey;
  label: ReactNode;
  component: React.ReactNode;
};
