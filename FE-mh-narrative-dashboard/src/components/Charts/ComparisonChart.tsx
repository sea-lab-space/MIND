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
  Label,
} from "recharts";
import type { ComparisonSpec, DataPoint } from "@/types/insightSpec";
import { extent } from "d3-array";
import { dateBetween } from "@/utils/dateHelper";
import {
  getColors,
  HIGHLIGHT_COLOR,
  HIGHLIGHT_FILL_OPACITY,
} from "@/utils/colorHelper";
import { calcAverageBetweenDate, getUpperLimitScale } from "@/utils/dataHelper";
import { useEffect, useRef, useState } from "react";
import { useWindowSize } from "react-use";

interface ComparisonChartProps {
  data: DataPoint[];
  spec: ComparisonSpec;
  themeColor: string;
}

const ComparisonChart: React.FC<ComparisonChartProps> = (props) => {
  const { data, spec, themeColor } = props;

  const metricKey = Object.keys(data[0] || {}).find((k) => k !== "date") ?? "";

  const { baseColor, highlightColor } = getColors(themeColor);

  const yRange = extent(data, (d: any) => d[metricKey]) as [number, number];
  const { yRangeUse, tickBreakUnit } = getUpperLimitScale(yRange[1]);

  const isShowAvg = spec.aggregation === "stdev";

  const avg_time_1 = calcAverageBetweenDate(
    data,
    spec.time_dur_1.time_start,
    spec.time_dur_1.time_end,
    metricKey
  );

  const avg_time_2 = calcAverageBetweenDate(
    data,
    spec.time_dur_2.time_start,
    spec.time_dur_2.time_end,
    metricKey
  );

  const showVal = isShowAvg
    ? {
        time_1: avg_time_1,
        time_2: avg_time_2,
      }
    : {
        time_1: spec.value_dur_1,
        time_2: spec.value_dur_2,
      };

  // console.log(showVal)

  const visData = data.map((d) => ({
    ...d,
  }));

  const chartRef = useRef<HTMLDivElement>(null);
  const [chartSize, setChartSize] = useState({ width: 500, height: 300 });
  const { width, height } = useWindowSize();
  useEffect(() => {
    if (chartRef.current) {
      const { width, height } = chartRef.current.getBoundingClientRect();
      setChartSize({ width, height });
    }
  }, [width, height]);

  const renderLabel = (props: any, value: number) => {
    const { offset } = props;
    const { x, y, width } = props.viewBox;

    const labelWidth = 120;
    const labelHeight = 30;

    // Initial positions
    let labelX = x + width / 2 - labelWidth / 2;
    let labelY = y + offset;

    // Adjust X if label goes beyond chart boundaries
    if (labelX < 0) {
      labelX = 0;
    } else if (labelX + labelWidth > chartSize.width) {
      labelX = chartSize.width - labelWidth;
    }

    // Adjust Y if label goes above the top
    if (labelY < 0) {
      labelY = 0;
    } else if (labelY + labelHeight > chartSize.height) {
      labelY = chartSize.height - labelHeight;
    }

    return (
      <foreignObject
        x={labelX}
        y={labelY}
        width={labelWidth}
        height={labelHeight}
      >
        <div
          className="bg-white/70 text-gray-500 text-xs flex items-center justify-center text-center leading-snug px-1"
          style={{ width: "100%", height: "100%" }}
        >
          {`${spec.aggregation} is ${value.toFixed(2)}`}
        </div>
      </foreignObject>
    );
  };

  return (
    <div ref={chartRef} style={{ width: "100%", height: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={visData}
          // margin={{ top: 20, left: 0, right: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <ReferenceArea
            x1={spec.time_dur_1.time_start}
            x2={spec.time_dur_1.time_end}
            y1={0}
            y2={yRangeUse}
            // stroke=HIGHLIGHT_COLOR
            fillOpacity={HIGHLIGHT_FILL_OPACITY}
          />
          <ReferenceArea
            x1={spec.time_dur_2.time_start}
            x2={spec.time_dur_2.time_end}
            y1={0}
            y2={yRangeUse}
            // stroke=HIGHLIGHT_COLOR
            fillOpacity={HIGHLIGHT_FILL_OPACITY}
          />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} />
          <YAxis
            domain={[0, yRangeUse]}
            minTickGap={0}
            tickCount={yRangeUse / tickBreakUnit}
            scale="linear"
            type="number"
          >
            {/* <Label
              value={spec.name}
              position='insideTopRight'
              angle={-90}
              offset={60}
            /> */}
          </YAxis>
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

          {spec.time_dur_1.time_start == spec.time_dur_1.time_end ? (
            <ReferenceDot
              x={spec.time_dur_1.time_start}
              y={showVal?.time_1}
              fill={HIGHLIGHT_COLOR}
              r={5}
            />
          ) : (
            <ReferenceLine
              label={(props) => renderLabel(props, spec.value_dur_1)}
              stroke={HIGHLIGHT_COLOR}
              strokeWidth={3}
              strokeDasharray="3 3"
              segment={[
                { x: spec.time_dur_1.time_start, y: showVal?.time_1 },
                { x: spec.time_dur_1.time_end, y: showVal?.time_1 },
              ]}
            />
          )}

          {spec.time_dur_2.time_start == spec.time_dur_2.time_end ? (
            <ReferenceDot
              x={spec.time_dur_2.time_start}
              y={showVal?.time_2}
              fill={HIGHLIGHT_COLOR}
              r={5}
              label={(props) => renderLabel(props, spec.value_dur_2)}
            />
          ) : (
            <ReferenceLine
              label={(props) => renderLabel(props, spec.value_dur_2)}
              stroke={HIGHLIGHT_COLOR}
              strokeWidth={3}
              strokeDasharray="3 3"
              segment={[
                { x: spec.time_dur_2.time_start, y: showVal?.time_2 },
                { x: spec.time_dur_2.time_end, y: showVal?.time_2 },
              ]}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComparisonChart;
