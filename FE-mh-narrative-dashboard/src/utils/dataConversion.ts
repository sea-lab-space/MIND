import type {DatasourceIconTypes, DataSourceType, InsightCardData} from "@/types/props";
import visualizerData from "@/data/Visualizer_INS-W_963.json";
import {InsightType} from "@/types/props";

export const convertGroupedInsightResultsToFE = (): InsightCardData[] => {
    return visualizerData.map((group, index): InsightCardData => ({
        key: `insight-${index + 1}`,
        summaryTitle: group.summaryTitle,
        sources: group.sources.map((type: string) => ({
            type: type.trim() as keyof typeof DatasourceIconTypes
        })),
        insightType: group.insightType.map((type: string) => ({
            type: type as keyof typeof InsightType
        })),
        expandView: group.expandView.map((insight: any, idx: number) => ({
            key: `insight-${index + 1}-detail-${idx+1}`,
            summarySentence: insight.summarySentence,
            dataPoints: insight.dataPoints,
            dataSourceType: insight.dataSourceType as DataSourceType,
            sources: insight.sources.map((type: string) => ({
                type: type as keyof typeof DatasourceIconTypes
            }))
        }))
    }));
};


export function normalizeDataPoints(
    rawData: Record<string, number | null> | any[]
){
    if (Array.isArray(rawData)) return rawData;
    return Object.entries(rawData).map(([date, value]) => ({
        date,
        value,
    }));
}