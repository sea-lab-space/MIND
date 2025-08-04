import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { DataPoint, DifferenceSpec, ValueSpec } from "@/types/insightSpec";
import { color } from "d3";
import { dateBetween } from "@/utils/dateHelper";
import { getColors, MAX_BAR_SIZE } from "@/utils/colorHelper";

interface DifferenceChartProps {
  data: DataPoint[];
  spec: DifferenceSpec;
  themeColor: string;
}
const DifferenceChart: React.FC<DifferenceChartProps> = (props) => {
  const { data, spec, themeColor } = props;

  const metricKey = Object.keys(data[0] || {}).find((k) => k !== "date") ?? "";

  const {baseColor, highlightColor} = getColors(themeColor)

  const visData = data.map((d) => ({
    ...d,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart width={500} height={300} data={visData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tick={{ fontSize: 10 }} />
        <YAxis />
        <Tooltip />
        <Bar
          dataKey={metricKey}
          isAnimationActive={false}
          maxBarSize={MAX_BAR_SIZE}
        >
          {visData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                entry.date === spec.time_1 || entry.date === spec.time_2
                  ? highlightColor
                  : baseColor
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DifferenceChart;
