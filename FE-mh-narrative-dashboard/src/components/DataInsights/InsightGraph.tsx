import {
    LineChart, Line, BarChart, Bar,
    CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import { DataSourceType } from "@/types/props";
import {normalizeDataPoints} from "@/utils/dataConversion";


interface InsightGraphProps {
    dataSourceType: DataSourceType;
    data: Record<String,number>;
}

export default function InsightGraph({ dataSourceType, data }: InsightGraphProps) {
    const normalized = normalizeDataPoints(data);
    const metricKey = Object.keys(normalized[0] || {}).find((k) => k !== "date") ?? "";

    const isLineChart = [DataSourceType.TREND, DataSourceType.COMPARISON].includes(dataSourceType);
    const isBarChart = [DataSourceType.EXTREME, DataSourceType.DIFFERENCE].includes(dataSourceType);

    const shouldShowChart = metricKey && (isLineChart || isBarChart);
console.log(data,dataSourceType, isLineChart)
    if (!shouldShowChart) {
        return null;
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            {isLineChart ? (
                <LineChart data={normalized}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey={metricKey}
                        stroke="#626681"
                        dot={{ r: 2 }}
                        strokeWidth={2}
                        isAnimationActive={false}
                    />
                </LineChart>
            ) : (
                <BarChart data={normalized}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey={metricKey} fill="#626681" isAnimationActive={false} />
                </BarChart>
            )}
        </ResponsiveContainer>
    );
}
