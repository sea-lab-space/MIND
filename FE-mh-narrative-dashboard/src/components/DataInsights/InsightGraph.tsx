import {
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
import { PASSIVE_SENSING_COLOR } from "@/utils/colorHelper";

interface InsightGraphProps {
    dataSourceType: DataSourceType;
    highlightSpec?: HighlightSpec;
    data: Record<string, number>;
    color?: string;
    isSurvey?: boolean;
}

export default function InsightGraph({
                                         dataSourceType,
                                         highlightSpec,
                                         data,
                                         color,
                                     }: InsightGraphProps) {
    const normalized = normalizeDataPoints(data);
    const metricKey =
        Object.keys(normalized[0] || {}).find((k) => k !== "date") ?? "";

    const shouldShowChart = metricKey // && (isLineChart || isBarChart);
    if (!shouldShowChart) {
        return null;
    }

    const visMap: Record<DataSourceType, React.ReactElement> = {
      extreme: (
        <ExtremeChart
          data={normalized}
          spec={highlightSpec as ExtremeSpec}
          themeColor={color ?? PASSIVE_SENSING_COLOR}
        />
      ),
      "derived value": (
        <DerivedValueChart
          data={normalized}
          spec={highlightSpec as ValueSpec}
          themeColor={color ?? PASSIVE_SENSING_COLOR}
        />
      ),
      difference: (
        <DifferenceChart
          data={normalized}
          spec={highlightSpec as DifferenceSpec}
          themeColor={color ?? PASSIVE_SENSING_COLOR}
        />
      ),
      comparison: (
        <ComparisonChart
          data={normalized}
          spec={highlightSpec as ComparisonSpec}
          themeColor={color ?? PASSIVE_SENSING_COLOR}
        />
      ),
        raw: (
            <TrendChart
                data={normalized}
                themeColor={color ?? "#8c92b8"}
            />
        ),
      trend: (
        <TrendChart
          data={normalized}
          spec={highlightSpec as TrendSpec}
          themeColor={color ?? PASSIVE_SENSING_COLOR}
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
