import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  ReferenceLine,
  ReferenceDot,
  Legend,
} from "recharts";
import type { DataPoint, OutlierSpec } from "@/types/insightSpec";
import { extent } from "d3-array";
import {
  getColors,
  HIGHLIGHT_COLOR,
  HIGHLIGHT_FILL_OPACITY,
} from "@/utils/colorHelper";
import { getUpperLimitScale, getYRange } from "@/utils/dataHelper";

interface OutlierChartProps {
  data: DataPoint[];
  spec?: OutlierSpec;
  themeColor: string;
}

const knownThreshHold = {
  "PSS-4 Score (0-16)": 6,
  "PHQ-4 Depression Subscale (0-6)": 3,
  "PHQ-4 Anxiety Subscale (0-6)": 3,
  "PHQ-4 (0-12)": 6,
};

const OutlierChart: React.FC<OutlierChartProps> = (props) => {
  const { data, spec, themeColor } = props;

  const metricKey = Object.keys(data[0] || {}).find((k) => k !== "date") ?? "";

  const { baseColor, highlightColor } = getColors(themeColor);

  const yRange = getYRange(data, metricKey);
  const { yRangeUse, tickBreakUnit } = getUpperLimitScale(yRange[1]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart width={500} height={300} data={data}>
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

        <Line
          dataKey={metricKey}
          isAnimationActive={false}
          stroke={baseColor}
          dot={{ r: 2 }}
          strokeWidth={2}
        />
        <ReferenceDot
          x={spec?.time}
          y={spec?.value}
          r={4.5}
          fill={highlightColor}
          stroke="none"
        />
        <Legend
          iconSize={14}
          wrapperStyle={{ fontSize: "14px" }}
          align="left"
          verticalAlign="top"
          height={32}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default OutlierChart;
