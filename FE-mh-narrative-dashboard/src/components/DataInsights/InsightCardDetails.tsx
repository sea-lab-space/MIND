import { type InsightCardData } from "@/types/props";
import InsightGraph from "@/components/DataInsights/InsightGraph";
import {shouldShowChart} from "@/utils/helper";

export interface InsightCardDetailProps {
    insightCardData: InsightCardData;
}

export default function InsightCardDetail({
                                              insightCardData,
                                          }: InsightCardDetailProps) {
    return (
        <div className="space-y-2 pt-3 pl-3 text-sm">
            <div className="space-y-4">
                {insightCardData.expandView.map((detail) => {
                    const showChart = shouldShowChart(detail.dataSourceType, detail.dataPoints);

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

                            {showChart && (
                                <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg h-48 pr-4 pt-2">
                                    <InsightGraph
                                        data={detail.dataPoints}
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



// import { type InsightCardData, DataSourceType } from "@/types/props";
// import InsightGraph from "@/components/DataInsights/InsightGraph";
// import { normalizeDataPoints } from "@/utils/dataConversion";

// export interface InsightCardDetailProps {
//     insightCardData: InsightCardData;
// }

// const validChartTypes = [
//     DataSourceType.TREND,
//     DataSourceType.COMPARISON,
//     DataSourceType.EXTREME,
//     DataSourceType.DIFFERENCE,
// ];

// // Helper to get N random items from an array
// function getRandomSubset<T>(array: T[], count: number): T[] {
//     const shuffled = [...array].sort(() => Math.random() - 0.5);
//     return shuffled.slice(0, count);
// }

// export default function InsightCardDetail({
//                                               insightCardData,
//                                           }: InsightCardDetailProps) {
//     // Limit to 3 random details
//     const selectedDetails =
//         insightCardData.expandView.length > 3
//             ? getRandomSubset(insightCardData.expandView, 3)
//             : insightCardData.expandView;

//     // Pick 1 random index to show a chart (if valid)
//     const chartIndex = Math.floor(Math.random() * selectedDetails.length);

//     return (
//         <div className="space-y-2 pt-3 pl-3 text-sm">
//             <div className="space-y-4">
//                 {selectedDetails.map((detail, index) => {
//                     const normalizedData = normalizeDataPoints(detail.dataPoints);
//                     const hasValidData =
//                         normalizedData.length > 0 &&
//                         Object.keys(normalizedData[0] || {}).some((k) => k !== "date");
//                     const shouldShowChart =
//                         validChartTypes.includes(detail.dataSourceType) && hasValidData;

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

//                             {index === chartIndex && shouldShowChart && (
//                                 <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg h-48 pr-4 pt-2">
//                                     <InsightGraph
//                                         data={normalizedData}
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
