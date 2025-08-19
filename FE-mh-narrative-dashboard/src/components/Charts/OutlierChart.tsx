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
} from "recharts";
import type { DataPoint, OutlierSpec } from "@/types/insightSpec";
import { extent } from "d3-array";
import {
  getColors,
  HIGHLIGHT_COLOR,
  HIGHLIGHT_FILL_OPACITY,
} from "@/utils/colorHelper";
import { getUpperLimitScale } from "@/utils/dataHelper";

interface OutlierChartProps {
  data: DataPoint[];
  spec?: OutlierSpec;
  themeColor: string;
}


const OutlierChart: React.FC<OutlierChartProps> = (props) => {
  const { data, spec, themeColor } = props;

  const metricKey = Object.keys(data[0] || {}).find((k) => k !== "date") ?? "";

  const { baseColor, highlightColor } = getColors(themeColor);

  const yRange = extent(data, (d: any) => d[metricKey]) as [number, number];
  const { yRangeUse, tickBreakUnit } = getUpperLimitScale(yRange[1]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart width={500} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        {/* {spec && (
          <ReferenceArea
            x1={spec.time_1}
            x2={spec.time_2}
            y1={0}
            y2={yRangeUse}
            fillOpacity={HIGHLIGHT_FILL_OPACITY}
          />
        )} */}
        <XAxis dataKey="date" tick={{ fontSize: 10 }} />
        <YAxis
          domain={[0, yRangeUse]}
          minTickGap={0}
          scale="linear"
          tickCount={yRangeUse / tickBreakUnit}
          type="number"
        />
        <Tooltip />

        {/* original data line */}
        <Line
          dataKey={metricKey}
          isAnimationActive={false}
          stroke={baseColor}
          dot={{ r: 2 }}
          strokeWidth={2}
          type="monotone"
        />
        <ReferenceDot
          x={spec?.time}
          y={spec?.value}
          r={6}
          fill={highlightColor}
          stroke="none"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default OutlierChart;
