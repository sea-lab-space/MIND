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
  ReferenceLine,
} from "recharts";
import type {
  DataPoint,
  ExtremeSpec,
} from "@/types/insightSpec";
import { getColors } from "@/utils/colorHelper";

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
    highlightVal: d.date === spec.time ? spec.value : null,
  }));

  const highlightDate = spec.time;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart width={500} height={300} data={visData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tick={{ fontSize: 10 }} />
        <YAxis />
        <Tooltip />
        <Bar dataKey={metricKey} isAnimationActive={false} maxBarSize={12}>
          {visData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.date === highlightDate ? highlightColor : baseColor}
            />
          ))}
          <LabelList dataKey="highlightVal" position="top" />
        </Bar>
        {/* <ReferenceLine
          y={spec.value}
          // label="Max"
          stroke="red"
          strokeDasharray="3 3"
        /> */}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ExtremeChart;