import {DatasourceIconTypes, DataSourceType } from "@/types/props";
import type { InsightExpandViewItem, InsightCardData} from "@/types/props";


const validChartTypes: DataSourceType[] = [
    DataSourceType.TREND,
    DataSourceType.COMPARISON,
    DataSourceType.EXTREME,
    DataSourceType.DIFFERENCE,
    DataSourceType.DERIVED_VALUE,
    DataSourceType.RAW,
    DataSourceType.OUTLIER
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

export function groupInsightsBySource(insights: InsightExpandViewItem[]) {
    const grouped: Record<string, InsightExpandViewItem[]> = {};

    for (const insight of insights) {
        const rawSource = insight.source;
        // console.log(insight, rawSource)
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

export const capitalizeFirst = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);


export function getUserFromHashUrl(): string {
  if (typeof window === "undefined") return "-";

  try {
    const hash = window.location.hash; // e.g. "#/baseline?user=Orson"
    const queryIndex = hash.indexOf("?");
    if (queryIndex === -1) return "-";

    const queryString = hash.slice(queryIndex + 1);
    const params = new URLSearchParams(queryString);
    return params.get("user") ?? "-";
  } catch (error) {
    console.error("Error parsing user from hash:", error);
    return "-";
  }
}

export function getTimerSettingFromHashUrl(): number {
  if (typeof window === "undefined") return 0;

  try {
    const hash = window.location.hash; // e.g. "#/baseline?user=Orson&timer=5"
    const queryIndex = hash.indexOf("?");
    if (queryIndex === -1) return 0;

    const queryString = hash.slice(queryIndex + 1);
    const params = new URLSearchParams(queryString);
    const timerParam = params.get("timer");

    const timer = timerParam ? Number(timerParam) : 0;
    return isNaN(timer) ? 0 : timer;
  } catch (error) {
    console.error("Error parsing timer from hash:", error);
    return 0;
  }
}

