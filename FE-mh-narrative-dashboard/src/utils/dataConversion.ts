import type {DatasourceIconType, DataSourceType, InsightCardData} from "@/types/props";
import {DatasourceIconTypes} from "@/types/props";
import Gabriella_Lin_Data from "@/data/INS-W_963.json"
import Lucy_Sutton_Data from "@/data/INS-W_1044.json"
import Alison_Daniels_Data from "@/data/INS-W_1077.json"
import type {InsightExpandViewItem, InsightType} from "@/types/props";
import type { HighlightSpec, OverviewSpec, InputSpecStructure } from "@/types/insightSpec";
import type { Encounter, SuggestedActivity } from "@/types/dataTypes";



const personDataMap: Record<string, InputSpecStructure> = {
    "Gabriella Lin": Gabriella_Lin_Data,
    "Lucy Sutton": Lucy_Sutton_Data,
    "Alison Daniels": Alison_Daniels_Data,
};

const sourceOrder: Record<DatasourceIconType, number> = {
    [DatasourceIconTypes.passiveSensing]: 1,
    [DatasourceIconTypes.surveyScore]: 2,
    [DatasourceIconTypes.clinicalNotes]: 3,
    [DatasourceIconTypes.clinicalTranscripts]: 4,
};


export const getVisualizerDataForPerson = (personName: string) => {
    const personData = personDataMap[personName];

    if (!personData) {
        console.warn(`No data found for ${personName}`);
        return {
          overviewCardData: {} as OverviewSpec,
          insightCardData: [],
          session_subjective_info: [],
          survey_data: [],
          suggested_activity_data: [],
          passive_data_raw: [],
          last_encounter: []
        };
    }

    const overviewCardData = personData.overview as OverviewSpec;
    const insightCardData: InsightCardData[] = personData.insights.map((group, index) => {
        const sources = group.sources
            .map((type: string) => ({type: type.trim() as DatasourceIconType,})).sort((a, b) => sourceOrder[a.type] - sourceOrder[b.type]);

        const expandView = group.expandView
            .map((insight: any, idx: number) =>
                ({
                    ...insight,
                    key: `insight-${index + 1}-detail-${idx + 1}`,
                    summarySentence: insight.summarySentence,
                    dataPoints: insight.dataPoints,
                    dataSourceType: insight.dataSourceType as DataSourceType,
                    highlightSpec: insight.spec as HighlightSpec,
                    source: insight.sources[0] as keyof typeof DatasourceIconTypes,
                    isShowL2: insight.isShowL2 as boolean,
                }) as InsightExpandViewItem
            )
        return {
            key: `insight-${index + 1}`,
            summaryTitle: group.summaryTitle,
            sources,
            insightType: group.insightType.map((type: string) => ({
                type: type as InsightType,
            })),
            expandView,
        };
    });
    const session_subjective_info = personData.session_subjective_info as Encounter[];
    const survey_data = (personData.survey_raw as InsightExpandViewItem[]).map((item, index) => ({
        ...item,
        key: `survey-${index}`,
    }));
    const suggested_activity_data = personData.suggest_activity as SuggestedActivity[];
    const passive_data_raw = personData.passive_data_raw as any[];

    const last_encounter: InsightCardData[] = personData.last_encounter.map(
      (group, index) => ({
        key: `last-encounter-${index + 1}`,
        summaryTitle: group.summaryTitle,
        sources: group.sources.map((type: string) => ({
          type: type.trim() as DatasourceIconType,
        })),
        insightType: group.insightType.map((type: string) => ({
          type: type as InsightType,
        })),
        expandView: group.expandView.map(
          (insight: any, idx: number) =>
            ({
              ...insight,
              key: `insight-${index + 1}-detail-${idx + 1}`,
              summarySentence: insight.summarySentence,
              dataPoints: insight.dataPoints,
              dataSourceType: insight.dataSourceType as DataSourceType,
              highlightSpec: insight.spec as HighlightSpec,
              source: insight.sources[0] as keyof typeof DatasourceIconTypes,
              isShowL2: insight.isShowL2 as boolean,
            } as InsightExpandViewItem)
        ),
      })
    );

    return {
      overviewCardData,
      insightCardData,
      session_subjective_info,
      survey_data,
      suggested_activity_data,
      passive_data_raw,
      last_encounter,
    };
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
