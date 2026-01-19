import InsightCardDetail from "@/components/DataInsights/InsightCardDetails";
import type { DatasourceIconType, InsightType } from "../../types/props";
import DataSourceIcon from "../DatasourceIcon";
import { Button } from "../ui/button";
import { ChartColumn } from "lucide-react";
import { type InsightCardData } from "../../types/props";
import { InsightTypeIconMap } from "@/types/dataTypes";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";


interface InsightCardProps {
  isExpanded?: boolean;
  title?: string;
  insightCardData: InsightCardData;
  sources: Array<{ type: DatasourceIconType }>;
  onToggle?: (cardKey: string, expanded: boolean) => void;
  isInsightHeaderSelected?: boolean;
  isInsightCardSelected?: boolean;
  handleCardSelect?: () => void;
  handleCardHeaderClick?: () => void;
  isDrillDown?: boolean;
}

export default function InsightCardComponent({
                                               isExpanded,
                                               insightCardData,
                                               isInsightHeaderSelected = false,
                                               isInsightCardSelected = false,
                                               handleCardSelect,
                                               handleCardHeaderClick,
                                               isDrillDown = false,
                                              //  onToggle
                                             }: InsightCardProps) {
  const showExpand = isDrillDown ? false : true;
  const [isExpandedLocal, setIsExpandedLocal] = useState(isExpanded);
  const [hoveringButton, setHoveringButton] = useState(false);
  const [isHeaderSelected, setIsHeaderSelected] = useState(
      isInsightHeaderSelected
  );

  useEffect(() => {
    if (showExpand === false) {
      setIsExpandedLocal(false);
    }
  }, [showExpand])

  useEffect(() => {
    setIsHeaderSelected(isInsightHeaderSelected);
  }, [isInsightHeaderSelected]);


  return (
    <div
      className={`w-full min-w-[200px] transition-all duration-200 rounded-xl px-3 py-2 text-left flex flex-col shrink-0
      ${
        isInsightCardSelected
          ? "bg-gray-100 border-gray-300 ring-2 ring-blue-500"
          : `bg-white border-gray-200 ${
              hoveringButton ? "shadow-xl" : "shadow-sm"
            }`
      }`}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="relative w-5 h-5 min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px] cursor-pointer mt-[1px]"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardHeaderClick?.();
                }}
              >
                <div
                  className={`absolute inset-0 rounded-full border-2 ${
                    isHeaderSelected ? "border-black" : "border-gray-400"
                  }`}
                >
                  {isHeaderSelected && (
                    <div className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black" />
                  )}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {isHeaderSelected
                ? "Toggle to remove from patient communication"
                : "Toggle to add to patient communication"}
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-row justify-between gap-2">
            <div className="flex flex-col gap-2 justify-between">
              <h2
                className="text-[16px] font-medium text-gray-900 leading-tight"
                onClick={(e) => e.stopPropagation()}
                style={{
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  hyphens: "auto",
                }}
                dangerouslySetInnerHTML={{
                  __html: insightCardData.summaryTitle,
                }}
              >
              </h2>
              <div>
                <div
                  className={`flex ${
                    isDrillDown ? "flex-col" : "flex-row justify-between"
                  } gap-y-2 pr-3 w-full`}
                >
                  {insightCardData?.insightType?.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium italic">
                        Insight Type:
                      </span>
                      {insightCardData.insightType.map((item, idx) => {
                        const Icon =
                          InsightTypeIconMap[item?.type as InsightType];
                        if (!Icon) return null;

                        return (
                          <div
                            key={idx}
                            className="inline-flex items-center gap-2 text-gray-700"
                          >
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Icon className="w-4.5 h-4.5" />
                              </TooltipTrigger>
                              <TooltipContent>{item?.type}</TooltipContent>
                            </Tooltip>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
          {isExpandedLocal && (
            <div
              className="pt-0 space-y-1.5 text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <InsightCardDetail
                insightCardDataExpandView={insightCardData?.expandView}
              />
            </div>
          )}

          <div className="flex items-center gap-1 mt-2 flex-wrap">
            <span className="text-xs font-small italic text-gray-600">
              Cited sources:
            </span>
            <div className="flex items-center gap-2 ml-3">
              {insightCardData.sources?.map((source, index) => (
                <DataSourceIcon key={index} iconType={source.type} />
              ))}
            </div>
            <div className="ml-auto">
              <Button
                onMouseEnter={() => setHoveringButton(true)}
                onMouseLeave={() => setHoveringButton(false)}
                onClick={handleCardSelect}
                variant="outline"
                size="default"
              >
                <ChartColumn />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

