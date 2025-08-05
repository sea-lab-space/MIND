import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import type {
  DataPoint,
  ExtremeSpec,
} from "@/types/insightSpec";
import { getColors, MAX_BAR_SIZE } from "@/utils/colorHelper";

interface ExtremeChartProps {
  data: DataPoint[];
  spec: ExtremeSpec;
  themeColor: string;
}

const ExtremeChart: React.FC<ExtremeChartProps> = (props) => {
  const { data, spec, themeColor } = props;

  const metricKey = Object.keys(data[0] || {}).find((k) => k !== "date") ?? "";

  const {baseColor, highlightColor} = getColors(themeColor)

  const visData = data.map((d) => ({
    ...d,
    [metricKey]: Number(Number(d[metricKey]).toFixed(2)),
    highlightVal: d.date === spec.time ? spec.value.toFixed(2) : null,
  }));

  const highlightDate = spec.time;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart width={500} height={300} data={visData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tick={{ fontSize: 10 }} />
        <YAxis />
        <Tooltip formatter={(value: number) => value.toFixed(2)} />
        <Bar
          dataKey={metricKey}
          isAnimationActive={false}
          maxBarSize={MAX_BAR_SIZE}
        >
          {visData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.date === highlightDate ? highlightColor : baseColor}
            />
          ))}
          <LabelList dataKey="highlightVal" position="top" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ExtremeChart;