import {DataSourceType} from "@/types/props";


const validChartTypes: DataSourceType[] = [
    DataSourceType.TREND,
    DataSourceType.COMPARISON,
    DataSourceType.EXTREME,
    DataSourceType.DIFFERENCE,
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