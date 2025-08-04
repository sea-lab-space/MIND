import { Card, CardContent, CardHeader } from "@/components/ui/card";
import InsightCardDetail from "@/components/DataInsights/InsightCardDetails";
import type {DatasourceIconType, InsightType} from "../../types/props";
import DataSourceIcon from "../DatasourceIcon";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import { type InsightCardData } from "../../types/props";
import {InsightTypeIconMap} from "@/types/dataTypes";

interface InsightCardProps {
    isExpanded?: boolean;
    title?: string;
    insightCardData: InsightCardData;
    sources: Array<{ type: DatasourceIconType }>
    onToggle?: (expanded: boolean) => void;
    isInsightHeaderSelected?: boolean;
    isInsightCardSelected?: boolean;
    handleCardSelect?: () => void;
    handleCardHeaderClick?: () => void;
    isDrillDown?: boolean
}

export default function InsightCardComponent({
                                                 isExpanded,
                                                 insightCardData,
                                                 isInsightHeaderSelected = false,
                                                 isInsightCardSelected = false,
                                                 handleCardSelect,
                                                 handleCardHeaderClick,
                                                 isDrillDown=false
                                             }: InsightCardProps) {
    return (
        <div
            className={`w-full min-w-[200px] transition-all duration-200 rounded-xl px-3 py-2 text-left flex flex-col 
    ${isInsightCardSelected
                ? "bg-gray-100 border-gray-300 ring-2 ring-blue-500"
                : "bg-white border-gray-200 shadow-sm hover:shadow-md"
            }`}
        >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    {/* Left: Checkbox + Title */}
                    <div className="flex items-start gap-3">
                        <div
                            className="relative w-5 h-5 min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px] cursor-pointer mt-[1px]"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCardHeaderClick?.();
                            }}
                        >
                            <div
                                className={`absolute inset-0 rounded-full border-2 ${
                                    isInsightHeaderSelected ? "border-black" : "border-gray-400"
                                }`}
                            >
                                {isInsightHeaderSelected && (
                                    <div className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black" />
                                )}
                            </div>
                        </div>
                        <h2 className="text font-bold text-gray-900 leading-tight">
                            {insightCardData.summaryTitle}
                        </h2>
                    </div>

                    {/* Right: Drilldown Button */}
                    <Button onClick={handleCardSelect} className="self-start sm:self-auto" variant="outline"   size="sm"
                    >
                        <Search />
                    </Button>
                </div>

            {isExpanded && (
                <div className="pt-0 space-y-2 text-left">
                    <InsightCardDetail insightCardDataExpandView={insightCardData?.expandView}/>
                </div>
            )}

            <div
                className={`flex ${
                    isDrillDown ? "flex-col" : "flex-row justify-between"
                } gap-y-2 pt-2 pl-5 pr-3 w-full`}
            >
                {/* Left: Sources */}
                <div className="flex items-center gap-1">
                    <span className="text-xs font-medium italic">Sources:</span>
                    <div className="flex items-center gap-2 ml-3">
                        {insightCardData.sources?.map((source, index) => (
                            <div key={index} className="flex items-center">
                                <DataSourceIcon iconType={source.type} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Insight Types */}
                {insightCardData?.insightType?.length > 0 && (
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium italic">Insight Type:</span>
                        {insightCardData.insightType.map((item, idx) => {
                            const Icon = InsightTypeIconMap[item?.type as InsightType];
                            if (!Icon) return null;

                            return (
                                <div key={idx}>
                                    <Icon className="w-4 h-4" />
                                </div>
                            );
                        })}
                    </div>
                )}

            </div>
        </div>
    );
}
