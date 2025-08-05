import type {DatasourceIconType, DatasourceIconTypes, DataSourceType, InsightCardData} from "@/types/props";
import visualizerData from "@/data/INS-W_963.json";
import Gabriella_Lin_Data from "@/data/INS-W_963.json"
import Lucy_Sutton_Data from "@/data/INS-W_1044.json"
import Alison_Daniels_Data from "@/data/INS-W_1077.json"
import type {InsightExpandViewItem, InsightType} from "@/types/props";
import type { HighlightSpec } from "@/types/insightSpec";
import type { Encounter, SuggestedActivity } from "@/types/dataTypes";

const personDataMap: Record<string, typeof visualizerData> = {
    "Gabriella Lin": Gabriella_Lin_Data,
    "Lucy Sutton": Lucy_Sutton_Data,
    "Alison Daniels": Alison_Daniels_Data,
};


export const getVisualizerDataForPerson = (personName: string) => {
    const personData = personDataMap[personName];

    if (!personData) {
        console.warn(`No data found for ${personName}`);
        return {
            overviewCardData: [],
            insightCardData: [],
        };
    }

    const overviewCardData = personData.overview;
    const insightCardData: InsightCardData[] = personData.insights.map((group, index) => ({
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
            highlightSpec: insight.spec as HighlightSpec,
            source: insight.sources[0] as keyof typeof DatasourceIconTypes,
        }) as InsightExpandViewItem)
    }));
    const session_subjective_info = personData.session_subjective_info as Encounter[];
    const survey_data = (personData.survey_raw as InsightExpandViewItem[]).map((item, index) => ({
        ...item,
        key: `survey-${index}`,
    }));
    const suggested_activity_data = personData?.suggest_activity as SuggestedActivity[];

    return {
        overviewCardData,
        insightCardData,
        session_subjective_info,
        survey_data,
        suggested_activity_data
    };
};


// TODO: rename function --> normalize does not mean that typically
export function normalizeDataPoints(
    rawData: Record<string, number | null> | any[]
){
    if (Array.isArray(rawData)) return rawData;
    return Object.entries(rawData).map(([date, value]) => ({
        date,
        value,
    }));
}
