import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { DataSourceType } from "@/types/props";
import { normalizeDataPoints } from "@/utils/dataConversion";
import type {
  ComparisonSpec,
  DifferenceSpec,
  ExtremeSpec,
  HighlightSpec,
  TrendSpec,
  ValueSpec,
} from "@/types/insightSpec";
import ExtremeChart from "../Charts/ExtremeChart";
import DerivedValueChart from "../Charts/DerivedValueChart";
import type { ReactHTMLElement } from "react";
import DifferenceChart from "../Charts/DifferenceChart";
import TrendChart from "../Charts/TrendChart";
import ComparisonChart from "../Charts/ComparisonChart";

interface InsightGraphProps {
  dataSourceType: DataSourceType;
  highlightSpec: HighlightSpec;
  data: Record<string, number>;
  color?: string;
  isSurvey?: boolean;
}

export default function InsightGraph({
  dataSourceType,
  highlightSpec,
  data,
  color,
  isSurvey = false,
}: InsightGraphProps) {
  const normalized = normalizeDataPoints(data);
  const metricKey =
    Object.keys(normalized[0] || {}).find((k) => k !== "date") ?? "";

  console.log(highlightSpec.fact_type);

  console.log(dataSourceType);
  // const isLineChart =
  //   (
  //     ["trend", "comparison"] as DataSourceType[]
  //   ).includes(dataSourceType) || isSurvey;
  // const isBarChart = (
  //   [
  //     "extreme",
  //     DataSourceType.DIFFERENCE,
  //     DataSourceType.DERIVED_VALUE,
  //   ] as DataSourceType[]
  // ).includes(dataSourceType);

  const shouldShowChart = metricKey // && (isLineChart || isBarChart);

  if (!shouldShowChart) {
    return null;
  }

  const visMap: Record<DataSourceType, React.ReactElement> = {
    extreme: (
      <ExtremeChart
        data={normalized}
        spec={highlightSpec as ExtremeSpec}
        themeColor={color ?? "#626681"}
      />
    ),
    "derived value": (
      <DerivedValueChart
        data={normalized}
        spec={highlightSpec as ValueSpec}
        themeColor={color ?? "#626681"}
      />
    ),
    difference: (
      <DifferenceChart
        data={normalized}
        spec={highlightSpec as DifferenceSpec}
        themeColor={color ?? "#626681"}
      />
    ),
    comparison: (
      <ComparisonChart
        data={normalized}
        spec={highlightSpec as ComparisonSpec}
        themeColor={color ?? "#626681"}
      />
    ),
    trend: (
      <TrendChart
        data={normalized}
        spec={highlightSpec as TrendSpec}
        themeColor={color ?? "#626681"}
      />
    ),
    text: <></>,
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      {visMap[dataSourceType]}
    </ResponsiveContainer>
  );
}

      /* {isLineChart ? (
        <LineChart data={normalized}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey={metricKey}
            stroke={color ?? "#626681"}
            dot={{ r: 2 }}
            strokeWidth={2}
            isAnimationActive={false}
            // connectNulls={true} // Uncomment if you'd like to visually connect missing data
          />
        </LineChart>
      ) : visMap[dataSourceType as DataSourceType] */
          
      // dataSourceType === DataSourceType.EXTREME ? (
      //   <ExtremeChart
      //     data={normalized}
      //     spec={highlightSpec as ExtremeSpec}
      //     themeColor={"#626681"}
      //   />
      // ) : (
      //   <BarChart data={normalized}>
      //     <CartesianGrid strokeDasharray="3 3" />
      //     <XAxis dataKey="date" tick={{ fontSize: 10 }} />
      //     <YAxis />
      //     <Tooltip />
      //     <Bar
      //       dataKey={metricKey}
      //       fill={color ?? "#626681"}
      //       isAnimationActive={false}
      //     />
      //   </BarChart>
      // )
      // }

