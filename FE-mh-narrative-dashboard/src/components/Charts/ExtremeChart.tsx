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
  Legend,
} from "recharts";
import type {
  DataPoint,
  ExtremeSpec,
} from "@/types/insightSpec";
import { getColors, MAX_BAR_SIZE } from "@/utils/colorHelper";
import { extent } from "d3";
import { getUpperLimitScale } from "@/utils/dataHelper";

interface ExtremeChartProps {
  data: DataPoint[];
  spec: ExtremeSpec;
  themeColor: string;
}

const ExtremeChart: React.FC<ExtremeChartProps> = (props) => {
  const { data, spec, themeColor } = props;

  const metricKey = Object.keys(data[0] || {}).find((k) => k !== "date") ?? "";

  const yRange = extent(data, (d: any) => d[metricKey]) as [number, number];
  const { yRangeUse, tickBreakUnit } = getUpperLimitScale(yRange[1]);

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
        <YAxis
          domain={[0, yRangeUse]}
          minTickGap={0}
          scale="linear"
          tickCount={yRangeUse / tickBreakUnit}
          type="number"
        />
        <Tooltip formatter={(value: number) => value.toFixed(2)} />
        <Bar
          dataKey={metricKey}
          isAnimationActive={false}
          maxBarSize={MAX_BAR_SIZE}
          fill={baseColor}
        >
          {visData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.date === highlightDate ? highlightColor : baseColor}
            />
          ))}
          <LabelList dataKey="highlightVal" position="top" />
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

export default ExtremeChart;