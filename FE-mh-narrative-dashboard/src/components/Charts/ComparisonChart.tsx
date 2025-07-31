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
import type { ComparisonSpec, DataPoint } from "@/types/insightSpec";
import { color } from "d3";
import { extent } from "d3-array";
import { dateBetween } from "@/utils/dateHelper";
import { getColors, HIGHLIGHT_FILL_OPACITY } from "@/utils/colorHelper";
import { calcAverageBetweenDate } from "@/utils/dataHelper";
import { useEffect, useState } from "react";

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



  const isShowAvg = spec.aggregation === "stdev";

  const avg_time_1 = 
    calcAverageBetweenDate(
      data,
      spec.time_dur_1.time_start,
      spec.time_dur_1.time_end,
      metricKey
    )

  const avg_time_2 = calcAverageBetweenDate(
    data,
    spec.time_dur_2.time_start,
    spec.time_dur_2.time_end,
    metricKey
  );

  const showVal = isShowAvg
    ? {
        time_1: avg_time_1,
        time_2: avg_time_2
      }
    : {
        time_1: spec.value_dur_1,
        time_2: spec.value_dur_2,
      };

  console.log(showVal)



  const visData = data.map((d) => ({
    ...d,
  }));

  const renderLabel = (props: any) => {
    // console.log(props.viewBox)
    const { offset } = props;
    const { x, y, width } = props.viewBox;
    // place label in the middle horizontally

    return (
      <foreignObject
        x={x + width / 2 - 80}
        y={y + offset}
        width={160}
        height={30}
        // style={{ overflow: "visible" }} is ${spec.value.toFixed(2)}
      >
        <div className="bg-white/70 text-gray-500 text-s flex items-center justify-center">
          {`${spec.aggregation}`}
        </div>
      </foreignObject>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart width={500} height={300} data={visData}>
        <CartesianGrid strokeDasharray="3 3" />
        <ReferenceArea
          x1={spec.time_dur_1.time_start}
          x2={spec.time_dur_1.time_end}
          y1={0}
          y2={yRange[1]}
          // stroke="red"
          fillOpacity={HIGHLIGHT_FILL_OPACITY}
        />
        <ReferenceArea
          x1={spec.time_dur_2.time_start}
          x2={spec.time_dur_2.time_end}
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

        <ReferenceLine
          label={renderLabel}
          stroke="red"
          strokeWidth={3}
          strokeDasharray="3 3"
          segment={[
            { x: spec.time_dur_1.time_start, y: showVal?.time_1 },
            { x: spec.time_dur_1.time_end, y: showVal?.time_1 },
          ]}
        />

        <ReferenceLine
          label={renderLabel}
          stroke="red"
          strokeWidth={3}
          strokeDasharray="3 3"
          segment={[
            { x: spec.time_dur_2.time_start, y: showVal?.time_2 },
            { x: spec.time_dur_2.time_end, y: showVal?.time_2 },
          ]}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ComparisonChart;
