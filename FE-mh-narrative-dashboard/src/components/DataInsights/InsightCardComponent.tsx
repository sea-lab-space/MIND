import { Card, CardContent, CardHeader } from "@/components/ui/card";
import InsightCardDetail from "@/components/DataInsights/InsightCardDetails";
import type { DatasourceIconType } from "../../types/props";
import DataSourceIcon from "../DatasourceIcon";
import { Button } from "../ui/button";
import { Search } from "lucide-react";

interface InsightCardProps {
    isExpanded?: boolean;
    title?: string;
    sources: Array<{
        type: DatasourceIconType;
    }>;
    onToggle?: (expanded: boolean) => void;
    isInsightHeaderSelected?: boolean;
    isInsightCardSelected?: boolean;
    handleCardSelect?: () => void;
    handleCardHeaderClick?: () => void;
}

export default function InsightCardComponent({
                                                 isExpanded,
                                                 title = "Growing Activity Level Despite Persistent Fatigue",
                                                 sources,
                                                 isInsightHeaderSelected = false,
                                                 isInsightCardSelected = false,
                                                 handleCardSelect,
                                                 handleCardHeaderClick,
                                             }: InsightCardProps) {
    return (
        <Card
            className={`w-full min-w-[200px] transition-all duration-200 hover:shadow-md border text-left flex flex-col ${isInsightCardSelected ? "bg-gray-100 border-gray-300 ring-2 ring-blue-500" : "bg-white border-gray-200"}`}
        >
            <CardHeader className="pb-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    {/* Left: Checkbox + Title */}
                    <div className="flex items-start gap-3">
                        <div
                            className="relative w-5 h-5 min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px] cursor-pointer mt-[3px]"
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
                        <h2 className="text-lg font-bold text-gray-900 leading-tight">
                            {title}
                        </h2>
                    </div>

                    {/* Right: Drilldown Button */}
                    <Button onClick={handleCardSelect} className="self-start sm:self-auto" variant="outline">
                        <Search />
                    </Button>
                </div>
            </CardHeader>

            {isExpanded && (
                <CardContent className="pt-0 space-y-6 text-left">
                    <InsightCardDetail />
                </CardContent>
            )}

            <div className="flex items-center gap-1 pt-4 pl-5 pb-4 text-left justify-start">
                <span className="text-xs font-medium italic">Sources:</span>
                <div className="flex items-center gap-2 ml-3">
                    {sources.map((source, index) => (
                        <div key={index} className="flex items-center">
                            <DataSourceIcon iconType={source.type} />
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
}
