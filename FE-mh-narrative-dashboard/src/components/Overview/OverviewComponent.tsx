import OverviewCardComponent from "@/components/Overview/OverviewCardComponent";
import { Activity, Brain, Heart } from "lucide-react";
import {data} from "@/data/data";
import {iconMap} from "@/types/props";

interface OverviewComponentProps {
  isExpanded: boolean;
  isDrillDown: boolean;
}
export default function OverviewComponent({
                                            isExpanded,
                                            isDrillDown,
                                          }: OverviewComponentProps) {
    const overviewData = data.overview;
    const basicInfoCardData = overviewData.basicInfoCard;
    const infoData = overviewData.infoCards;

    return (
      <div className="transition-all duration-300 text-sm">
            <div
                className={`flex gap-4 mx-auto items-stretch ${
                    isDrillDown ? "flex-col" : "flex-col sm:flex-row"
                }`}
            >
              <div className={isDrillDown ? "w-full" : "sm:w-1/4"}>
                <div className="h-full bg-white shadow-sm rounded-xl p-4 border border-gray-200 flex flex-col">
                  <h3 className="text-lg font-semibold mb-2">Overview Summary</h3>
                    <div className="space-y-2">
                        {Object.entries(basicInfoCardData).map(([key, value]) => (
                            <div key={key} className="flex flex-wrap text-sm text-gray-700">
                              <span className="font-semibold text-gray-900 mr-1">
                                {key}:
                              </span>
                                <span>{value}</span>
                            </div>
                        ))}
                    </div>
                </div>
              </div>

                    <div className={`flex flex-col gap-4 ${isDrillDown ? "w-full" : "sm:w-3/4"}`}>
                        {infoData.map((card, index) => {
                            const Icon = iconMap[card.icon]; // dynamically resolve icon component
                            return (
                                <OverviewCardComponent
                                    key={index}
                                    icon={Icon}
                                    title={card.overviewHeadTitle}
                                >
                                    {isExpanded ? card.cardContent.expanded : card.cardContent.folded}
                                </OverviewCardComponent>
                            );
                        })}
                    </div>

            </div>
      </div>
  );
}
