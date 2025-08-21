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
  Legend,
} from "recharts";
import type { DataPoint, TrendSpec } from "@/types/insightSpec";
import { extent } from "d3-array";
import {
  getColors,
  HIGHLIGHT_COLOR,
  HIGHLIGHT_FILL_OPACITY,
} from "@/utils/colorHelper";
import { getUpperLimitScale } from "@/utils/dataHelper";

interface TrendChartProps {
  data: DataPoint[];
  spec?: TrendSpec;
  themeColor: string;
}

// --- regression helper ---
function linearRegression(xs: number[], ys: number[]) {
  const n = xs.length;
  const sumX = xs.reduce((a, b) => a + b, 0);
  const sumY = ys.reduce((a, b) => a + b, 0);
  const sumXY = xs.reduce((sum, x, i) => sum + x * ys[i], 0);
  const sumXX = xs.reduce((sum, x) => sum + x * x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
}

const TrendChart: React.FC<TrendChartProps> = (props) => {
  const { data, spec, themeColor } = props;

  const metricKey = Object.keys(data[0] || {}).find((k) => k !== "date") ?? "";

  const { baseColor, highlightColor } = getColors(themeColor);

  const yRange = extent(data, (d: any) => d[metricKey]) as [number, number];
  const { yRangeUse, tickBreakUnit } = getUpperLimitScale(yRange[1]);

  const auxilaryLine = () => {
    if (!spec) return null;

    const start = new Date(spec.time_1).getTime();
    const end = new Date(spec.time_2).getTime();

    const subset = data.filter((d) => {
      const t = new Date(d.date).getTime();
      return t >= start && t <= end;
    });

    if (subset.length < 2) return null;

    const xs = subset.map((d) => new Date(d.date).getTime());
    const ys = subset.map((d) => d[metricKey] as number);

    const { slope, intercept } = linearRegression(xs, ys);

    const y1 = slope * start + intercept;
    const y2 = slope * end + intercept;

    const isShowLine = spec.attribute === "rise" || spec.attribute === "fall";

    return (
      isShowLine &&
      <ReferenceLine
        stroke={highlightColor}
        strokeWidth={2}
        strokeDasharray="3 3"
        segment={[
          { x: spec.time_1, y: y1 },
          { x: spec.time_2, y: y2 },
        ]}
      />
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart width={500} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        {spec && (
          <ReferenceArea
            x1={spec.time_1}
            x2={spec.time_2}
            y1={yRange[0] < 0 ? yRange[0] : 0}
            y2={yRangeUse}
            fillOpacity={HIGHLIGHT_FILL_OPACITY}
          />
        )}
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
        />

        {/* regression aux line */}
        {auxilaryLine()}
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

export default TrendChart;
