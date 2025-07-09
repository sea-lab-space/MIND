import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import InsightCardDetail from "@/components/InsightCardDetails";
import type { DatasourceIconType } from "../types/props";
import DataSourceIcon from "./DatasourceIcon";
import { Button } from "./ui/button";
import { Search } from "lucide-react";

interface InsightCardProps {
  isExpanded?: boolean;
  title?: string;
  sources: Array<{
    type: DatasourceIconType;
  }>;
  onToggle?: (expanded: boolean) => void;
  isSelected?: boolean;
  onSelect?: () => void;
  onClick?: () => void;
}

// TODO: link the insights with a uniformed id, just pass the id for global data retrieval
export default function InsightCardComponent({
  isExpanded = false,
  title = "Growing Activity Level Despite Persistent Fatigue",
  sources,
  onToggle,
  isSelected = true,
  onSelect,
  onClick,
}: InsightCardProps) {
  const [detailExpanded, setDetailExpanded] = useState(isExpanded);

  return (
    <Card className="w-full max-w-[700px] transition-all duration-200 hover:shadow-md border border-gray-200 bg-white text-left">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <div
            className="relative w-5 h-5 min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px] cursor-pointer mt-[3px]"
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.();
            }}
          >
            <div
              className={`absolute inset-0 rounded-full border-2 ${
                isSelected ? "border-black" : "border-gray-400"
              }`}
            >
              {isSelected && (
                <div className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black"></div>
              )}
            </div>
          </div>
          <h2 className="text-lg font-bold text-gray-900 leading-tight">
            {title}
          </h2>
          {/* TODO: buttons fly off card */}
          <Button onClick={onClick} className="ml-auto" variant='outline'>
            <Search />
          </Button>
        </div>
      </CardHeader>

      {detailExpanded && (
        <CardContent className="pt-0 space-y-6 text-left">
          <InsightCardDetail />
        </CardContent>
      )}

      <div className="flex items-center gap-1 pt-4 pl-5 text-left justify-start">
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
