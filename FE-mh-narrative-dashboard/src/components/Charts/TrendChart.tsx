import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceArea,
  Customized,
  ReferenceLine,
} from "recharts";
import type { DataPoint, TrendSpec } from "@/types/insightSpec";
import { color } from "d3";
import { extent } from "d3-array";
import { dateBetween } from "@/utils/dateHelper";
import { getColors, HIGHLIGHT_COLOR, HIGHLIGHT_FILL_OPACITY } from "@/utils/colorHelper";

interface TrendChartProps {
  data: DataPoint[];
  spec?: TrendSpec;
  themeColor: string;
}

const TrendChart: React.FC<TrendChartProps> = (props) => {
  const { data, spec, themeColor } = props;

  const metricKey = Object.keys(data[0] || {}).find((k) => k !== "date") ?? "";

  const {baseColor, highlightColor} = getColors(themeColor)

  const yRange = extent(data, (d: any) => d[metricKey]) as [number, number];

  const getDataOnDate = (date: string): number => {
    const response = data.find((d) => d.date === date);
    if (!response || typeof response[metricKey] !== "number") {
      return 0;
    }
    return response[metricKey];
  };
  const auxilaryLine = () => {
    if (!spec) return null;

    if (spec.attribute === "rise" || spec.attribute === "fall") {
      return (
        <ReferenceLine
          stroke={HIGHLIGHT_COLOR}
          strokeWidth={3}
          strokeDasharray="3 3"
          strokeOpacity={1}
          segment={[
            { x: spec.time_1, y: getDataOnDate(spec.time_1) },
            { x: spec.time_2, y: getDataOnDate(spec.time_2) },
          ]}
        />
      );
    }

    return null;
  };



  const visData = data.map((d) => ({
    ...d,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart width={500} height={300} data={visData}>
        <CartesianGrid strokeDasharray="3 3" />
        {spec && (
            <ReferenceArea
          x1={spec.time_1}
          x2={spec.time_2}
          y1={0}
          y2={Math.ceil(yRange[1])}
          fillOpacity={HIGHLIGHT_FILL_OPACITY}
        />
        )}
        <XAxis dataKey="date" tick={{ fontSize: 10 }} />
        <YAxis domain={[0, Math.ceil(yRange[1])]} />
        <Tooltip />
        <Line
          dataKey={metricKey}
          isAnimationActive={false}
          stroke={baseColor}
          dot={{ r: 2 }}
          strokeWidth={2}
        >
          {/* {visData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                entry.date === spec.time_1 || entry.date === spec.time_2
                  ? highlightColor
                  : baseColor
              }
            />
          ))} */}
        </Line>
        {auxilaryLine()}

        {/* <Customized component={
          (props) => {
            console.log(props);
            return null
          }
        } /> */}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TrendChart;
