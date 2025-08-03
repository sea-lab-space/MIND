// Datasource types for icons
import type {InsightType, InsightExpandViewItem } from "@/types/props";

export enum DatasourceIconTypes {
    measurementScore = "measurementScore",
    clinicalNotes = "clinicalNotes",
    clinicalTranscripts = "clinicalTranscripts",
    passiveSensing = "passiveSensing"
}


export type RetrospectOptions = {
    [label: string]: number; // e.g., "Last 3 months": 90
};

// High-level insight card
export interface InsightCard {
    key: string;
    summaryTitle: string;
    sources: { type: DatasourceIconTypes }[];
    insightType?: InsightType[]; // optional: to show combined insights
    expandView: InsightExpandViewItem[];
}

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