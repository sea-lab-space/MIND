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
} from "recharts";
import type { DataPoint, TrendSpec } from "@/types/insightSpec";
import { color } from "d3";
import { extent } from "d3-array";
import { dateBetween } from "@/utils/dateHelper";
import { getColors, HIGHLIGHT_FILL_OPACITY } from "@/utils/colorHelper";

interface TrendChartProps {
  data: DataPoint[];
  spec: TrendSpec;
  themeColor: string;
}

const TrendChart: React.FC<TrendChartProps> = (props) => {
  const { data, spec, themeColor } = props;

  const metricKey = Object.keys(data[0] || {}).find((k) => k !== "date") ?? "";

  const {baseColor, highlightColor} = getColors(themeColor)

  const yRange = extent(data, (d: any) => d[metricKey]) as [number, number];


  const visData = data.map((d) => ({
    ...d,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart width={500} height={300} data={visData}>
        <CartesianGrid strokeDasharray="3 3" />
        <ReferenceArea
          x1={spec.time_1}
          x2={spec.time_2}
          y1={0}
          y2={yRange[1]}
          // stroke="red"
          fillOpacity={HIGHLIGHT_FILL_OPACITY}
        />
        <XAxis dataKey="date" tick={{ fontSize: 10 }} />
        <YAxis domain={[0, yRange[1]]} />
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
