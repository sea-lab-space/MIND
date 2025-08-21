import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import type { DataPoint, DifferenceSpec, ValueSpec } from "@/types/insightSpec";
import { color, extent } from "d3";
import { getColors, MAX_BAR_SIZE } from "@/utils/colorHelper";
import { getUpperLimitScale, getYRange } from "@/utils/dataHelper";

interface DifferenceChartProps {
  data: DataPoint[];
  spec: DifferenceSpec;
  themeColor: string;
}
const DifferenceChart: React.FC<DifferenceChartProps> = (props) => {
  const { data, spec, themeColor } = props;

  const metricKey = Object.keys(data[0] || {}).find((k) => k !== "date") ?? "";
  
  const yRange = getYRange(data, metricKey);
  const { yRangeUse, tickBreakUnit } = getUpperLimitScale(yRange[1]);
  
  const {baseColor, highlightColor} = getColors(themeColor)

  const visData = data.map((d) => ({
    ...d,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart width={500} height={300} data={visData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tick={{ fontSize: 10 }} />
        <YAxis
          domain={[0, yRangeUse]}
          minTickGap={0}
          scale="linear"
          tickCount={yRangeUse / tickBreakUnit}
          type="number"
        />
        <Tooltip />
        <Bar
          dataKey={metricKey}
          isAnimationActive={false}
          maxBarSize={MAX_BAR_SIZE}
          fill={baseColor}
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
        <Legend
          iconSize={14}
          wrapperStyle={{ fontSize: "14px" }}
          align="left"
          verticalAlign="top"
          height={32}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DifferenceChart;
