// Datasource types for icons
import {InsightType} from "@/types/props";

export enum DatasourceIconTypes {
    measurementScore = "measurementScore",
    clinicalNotes = "clinicalNotes",
    clinicalTranscripts = "clinicalTranscripts",
    passiveSensing = "passiveSensing"
}


export type RetrospectOptions = {
    [label: string]: number; // e.g., "Last 3 months": 90
};

// For each insight's expandable detail
export interface InsightExpandView {
    summarySentence: string;
    dataPoints: Record<string, number>;
    sources: { type: DatasourceIconTypes }[];
    insightType?: InsightType;
}

// High-level insight card
export interface InsightCard {
    key: string;
    summaryTitle: string;
    sources: { type: DatasourceIconTypes }[];
    insightType?: InsightType[]; // optional: to show combined insights
    expandView: InsightExpandView[];
}

// Overview info
export interface BasicInfoCard {
    name: string;
    age: number;
    race: string;
    income: number;
    relationship: string;
}

// Overview section card
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
