import {
    LineChart, Line, BarChart, Bar,
    CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import { DataSourceType } from "@/types/props";
import {normalizeDataPoints} from "@/utils/dataConversion";


interface InsightGraphProps {
    dataSourceType: DataSourceType;
    data: Record<String,number>;
    color?: string;
    isSurvey: boolean;
}

export default function InsightGraph({ dataSourceType, data, color, isSurvey= false }: InsightGraphProps) {
    const normalized = normalizeDataPoints(data);
    const metricKey = Object.keys(normalized[0] || {}).find((k) => k !== "date") ?? "";

    console.log(dataSourceType)
    const isLineChart = [DataSourceType.TREND, DataSourceType.COMPARISON].includes(dataSourceType) || isSurvey;
    const isBarChart = [DataSourceType.EXTREME, DataSourceType.DIFFERENCE, DataSourceType.DERIVED_VALUE].includes(dataSourceType);

    const shouldShowChart = metricKey && (isLineChart || isBarChart);

    if (!shouldShowChart) {
        return null;
    }

    return (
        <ResponsiveContainer width="100%"  height={300}>
            {isLineChart ? (
                <LineChart data={normalized}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="date" tick={{fontSize: 10}}/>
                    <YAxis/>
                    <Tooltip/>
                    <Line
                        type="monotone"
                        dataKey={metricKey}
                        stroke= {color? color : "#626681"}
                        dot={{r: 2}}
                        strokeWidth={2}
                        isAnimationActive={false}
                        connectNulls={true} // add this if needed
                    />
                </LineChart>
            ) : (
                <BarChart data={normalized}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="date" tick={{fontSize: 10}}/>
                    <YAxis/>
                    <Tooltip/>
                    <Bar dataKey={metricKey} fill={color? color : "#626681"} isAnimationActive={false}/>
                </BarChart>
            )}
        </ResponsiveContainer>
    );
}
