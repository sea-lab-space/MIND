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
  ComposedChart,
  Line,
  Customized,
  ReferenceArea,
} from "recharts";
import type { DataPoint, ValueSpec } from "@/types/insightSpec";
import { color, extent } from "d3";
import { dateBetween } from "@/utils/dateHelper";
import { getColors, HIGHLIGHT_FILL_OPACITY } from "@/utils/colorHelper";


interface DerivedValueChartProps {
  data: DataPoint[];
  spec: ValueSpec;
  themeColor: string;
}
const DerivedValueChart: React.FC<DerivedValueChartProps> = (props) => {
  const { data, spec, themeColor } = props;

  const metricKey = Object.keys(data[0] || {}).find((k) => k !== "date") ?? "";

  const {baseColor, highlightColor} = getColors(themeColor)

  const yRange = extent(data, (d: any) => d[metricKey]) as [number, number];

  const { sum, count } = data.reduce(
    (acc, curr) => {
      acc.sum += curr[metricKey] as number;
      acc.count += 1;
      return acc;
    },
    { sum: 0, count: 0 }
  )

  const showVal = spec.aggregation === 'stdev' ? sum / count : spec.value

  const visData = data.map((d) => ({
    ...d,
  }));

  const isHighlightBar = (entry: DataPoint) =>
    spec.aggregation === "max" || spec.aggregation === "min" ? entry[metricKey] === spec.value : false;


  const renderLabel = (props: any) => {
    // console.log(props.viewBox)
    const { offset } = props
    const { x, y, width } = props.viewBox;
    // place label in the middle horizontally

    return (
      <foreignObject
        x={x + width / 2 - 80 }
        y={y + offset}
        width={160}
        height={30}
        // style={{ overflow: "visible" }}
      >
        <div className="bg-white/70 text-gray-500 text-s flex items-center justify-center">
          {`${spec.aggregation} is ${spec.value.toFixed(2)}`}
        </div>
      </foreignObject>
    );
  };


  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart width={500} height={300} data={visData}>
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
        <Bar dataKey={metricKey} isAnimationActive={false} maxBarSize={12}>
          {visData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                dateBetween(entry.date, spec.time_1, spec.time_2) &&
                isHighlightBar(entry)
                  ? highlightColor
                  : baseColor
              }
            />
          ))}
          <ReferenceLine
            label={renderLabel}
            stroke="red"
            strokeWidth={3}
            strokeDasharray="3 3"
            segment={[
              { x: spec.time_1, y: showVal },
              { x: spec.time_2, y: showVal },
            ]}
          />
          {/* <Customized
            component={(chartProps: any) => {
              console.log(chartProps);
              return null;
            }}
          /> */}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DerivedValueChart;
