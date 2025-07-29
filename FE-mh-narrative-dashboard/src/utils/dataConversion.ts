import type {DatasourceIconType, DatasourceIconTypes, DataSourceType, InsightCardData} from "@/types/props";
import visualizerData from "@/data/Visualizer_INS-W_963.json";
import {InsightType} from "@/types/props";

export const convertGroupedInsightResultsToFE = (): InsightCardData[] => {
    return visualizerData.insights.map((group, index): InsightCardData => ({
        key: `insight-${index + 1}`,
        summaryTitle: group.summaryTitle,
        sources: group.sources.map((type: string) => ({
            type: type.trim() as DatasourceIconType
        })),
        insightType: group.insightType.map((type: string) => ({
            type: type as InsightType
        })),
        expandView: group.expandView.map((insight: any, idx: number) => ({
            key: `insight-${index + 1}-detail-${idx+1}`,
            summarySentence: insight.summarySentence,
            dataPoints: insight.dataPoints,
            dataSourceType: insight.dataSourceType as DataSourceType,
            spec: insight.spec,
            // sources: insight.sources.map((type: string) => ({
            //     type: type as keyof typeof DatasourceIconTypes
            // }))
            source: insight.sources[0] as keyof typeof DatasourceIconTypes,
        }))
    }));
};

// TODO: type definition
export const convertOverviewResultsToFE = (): any => {
    return visualizerData.overview;
}


export function normalizeDataPoints(
    rawData: Record<string, number | null> | any[]
){
    if (Array.isArray(rawData)) return rawData;
    return Object.entries(rawData).map(([date, value]) => ({
        date,
        value,
    }));
}
