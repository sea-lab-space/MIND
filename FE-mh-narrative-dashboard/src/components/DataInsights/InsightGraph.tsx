// InsightGraph.tsx
import {
    LineChart, Line, BarChart, Bar,
    CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import {DataSourceType} from "@/types/props";

interface DataPoint {
    date: string;
    [key: string]: number | string | null;
}

interface InsightGraphProps {
    dataSourceType: DataSourceType;
    data: DataPoint[];
}

export default function InsightGraph({ dataSourceType, data }: InsightGraphProps) {
    const metricKey = Object.keys(data[0] || {}).find((k) => k !== "date") ?? "";

    if (!metricKey) {
        return <div className="text-gray-500">No data available.</div>;
    }

    const isLineChart = [DataSourceType.TREND, DataSourceType.COMPARISON].includes(dataSourceType);
    const isBarChart = [DataSourceType.EXTREME, DataSourceType.DIFFERENCE].includes(dataSourceType);

    return (
        <ResponsiveContainer width="100%" height="100%">
            {isLineChart ? (
                <LineChart data={data}>
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
                    />
                </LineChart>
            ) : isBarChart ? (
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey={metricKey} fill="#626681" />
                </BarChart>
            ) : null}
        </ResponsiveContainer>
    );
}
