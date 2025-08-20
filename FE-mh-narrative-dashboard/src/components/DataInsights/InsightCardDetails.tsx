import { type InsightExpandViewItem } from "@/types/props";
import InsightGraph from "@/components/DataInsights/InsightGraph";
import { shouldShowChart } from "@/utils/helper";

export interface InsightCardDetailProps {
  insightCardDataExpandView: InsightExpandViewItem[] | undefined;
  isBaseline?: boolean;
}

export default function InsightCardDetail({
  insightCardDataExpandView,
  isBaseline = false,
}: InsightCardDetailProps) {
  let hasShownChart = false;

  const showAll = isBaseline ? true : false;

  return (
    <div className="space-y-2 pt-3 pl-3 text-sm">
      <div className="space-y-4">
        {insightCardDataExpandView?.map((detail, index) => {
          const showChart = shouldShowChart(
            detail.dataSourceType,
            detail.dataPoints
          );

          const shouldRenderChart = showAll ? showChart : showChart && index === 0;
          const shouldRenderFact = isBaseline ? true: detail.isShowL2

          if (shouldRenderChart) {
            hasShownChart = true;
          }

          return shouldRenderFact && (
            <div key={detail.key}>
              <div className="flex items-start gap-3">
                  <>
                    <div className="w-2 h-2 bg-gray-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 ml-1">
                      {detail.summarySentence}
                    </span>
                  </>
              </div>

              {shouldRenderChart && (
                <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg h-48 pr-4 pt-4">
                  <InsightGraph
                    data={detail.dataPoints}
                    highlightSpec={detail.highlightSpec}
                    dataSourceType={detail.dataSourceType}
                  />
                </div>
              )}
            </div>
          );
      })}
      </div>
    </div>
  );
}
