import {type InsightExpandViewItem} from "@/types/props";
import InsightGraph from "@/components/DataInsights/InsightGraph";
import {shouldShowChart} from "@/utils/helper";

export interface InsightCardDetailProps {
    insightCardDataExpandView: InsightExpandViewItem[] | undefined;
}

// export default function InsightCardDetail({
//                                               insightCardDataExpandView,
//                                           }: InsightCardDetailProps) {
//     return (
//         <div className="space-y-2 pt-3 pl-3 text-sm">
//             <div className="space-y-4">
//                 {insightCardDataExpandView?.map((detail) => {
//                     const showChart = shouldShowChart(detail.dataSourceType, detail.dataPoints);
//                     return (
//                         <div key={detail.key}>
//                             <div className="flex items-start gap-3">
//                                 <div className="w-2 h-2 bg-gray-600 rounded-full mt-2 flex-shrink-0"></div>
//                                 <div>
//                                     <span className="text-gray-700 ml-1">
//                                         {detail.summarySentence}
//                                     </span>
//                                 </div>
//                             </div>
//
//                             {showChart && (
//                                 <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg h-48 pr-4 pt-2">
//                                     <InsightGraph
//                                         data={detail.dataPoints}
//                                         highlightSpec={detail.highlightSpec}
//                                         dataSourceType={detail.dataSourceType}
//                                     />
//                                 </div>
//                             )}
//                         </div>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// }

export default function InsightCardDetail({
                                              insightCardDataExpandView,
                                          }: InsightCardDetailProps) {
    let hasShownChart = false;

    return (
        <div className="space-y-2 pt-3 pl-3 text-sm">
            <div className="space-y-4">
                {insightCardDataExpandView?.map((detail) => {
                    const showChart = shouldShowChart(detail.dataSourceType, detail.dataPoints);
                    const shouldRenderChart = showChart && !hasShownChart;

                    if (shouldRenderChart) {
                        hasShownChart = true;
                    }

                    return (
                        <div key={detail.key}>
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-gray-600 rounded-full mt-2 flex-shrink-0"></div>
                                <div>
                  <span className="text-gray-700 ml-1">
                    {detail.summarySentence}
                  </span>
                                </div>
                            </div>

                            {shouldRenderChart && (
                                <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg h-48 pr-4 pt-2">
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
