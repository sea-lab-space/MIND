import OverviewCardComponent from "@/components/Overview/OverviewCardComponent";
import {iconMap} from "@/types/props";

interface OverviewComponentProps {
  overviewData: any;
  isExpanded: boolean;
  isDrillDown: boolean;
}
export default function OverviewComponent({
                                            overviewData,
                                            isExpanded,
                                            isDrillDown,
                                          }: OverviewComponentProps) {
    const basicInfoCardData = overviewData.basicInfoCard;
    const infoData = overviewData.infoCards;

    return (
      <div className="transition-all duration-300 text-sm">
            <div
                className={`flex gap-4 mx-auto items-stretch ${
                    isDrillDown ? "flex-col" : "flex-col sm:flex-row"
                }`}
            >
              <div className={isDrillDown ? "w-full" : "sm:w-1/5"}>
                <div className="h-full bg-white shadow-sm rounded-xl px-3 py-2 border border-gray-200 flex flex-col">
                  <h3 className="text-base font-semibold mb-2">Overview Summary</h3>
                    <div className="space-y-1">
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

                    <div className={`flex flex-col gap-2 ${isDrillDown ? "w-full" : "sm:w-4/5"}`}>
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
