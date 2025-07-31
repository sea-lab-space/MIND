import {DatasourceIconTypes, DataSourceType } from "@/types/props";
import type { InsightExpandViewItem, InsightCardData} from "@/types/props";


const validChartTypes: DataSourceType[] = [
    DataSourceType.TREND,
    DataSourceType.COMPARISON,
    DataSourceType.EXTREME,
    DataSourceType.DIFFERENCE,
    DataSourceType.DERIVED_VALUE
];

export function shouldShowChart(
    dataSourceType: DataSourceType,
    sources: Record<string,number>
): boolean {
    if (!sources || !Array.isArray(sources) || sources.length === 0) return false;

    const hasValidKeys = Object.keys(sources[0] || {}).some((k) => k !== "date");
    const isValidType = validChartTypes.includes(dataSourceType);

    return isValidType && hasValidKeys;
}


const reverseMap = Object.entries(DatasourceIconTypes).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
}, {} as Record<string, string>);

export function flattenAllExpandViews(insightCards: InsightCardData[]): InsightExpandViewItem[] {
    return insightCards.flatMap(card => card.expandView ?? []);
}

export function groupInsightsBySource(insights: InsightExpandViewItem[] | undefined) {
    const grouped: Record<string, InsightExpandViewItem[]> = {};

    for (const insight of insights) {
        const rawSource = insight.source;
        const baseKey = reverseMap[rawSource];
        const groupKey = `${baseKey}Facts`;

        if (!grouped[groupKey]) {
            grouped[groupKey] = [];
        }
        grouped[groupKey].push(insight);
    }

    return grouped;
}


export function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}