import { Watch, MessageSquare, StickyNote, ClipboardList } from "lucide-react";
import type { DatasourceIconType, DatasourceIconProps } from "../types/props";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const DataSourceIcon: React.FC<DatasourceIconProps> = (props) => {
  const { iconType, showType = false } = props;

  const iconColor: {[key in DatasourceIconType]: string} = {
    "passive sensing": "text-slate-500",
    "transcripts": "text-emerald-500",
    "notes": "text-orange-500",
    "measurement score": "text-yellow-500"
  }

  const getSourceIcon = (type: DatasourceIconType) => {
    switch (type) {
      case "passive sensing":
        return <Watch className="w-5 h-5" />;
      case "transcripts":
        return <MessageSquare className="w-5 h-5" />;
      case "notes":
        return <StickyNote className="w-5 h-5" />;
      case "measurement score":
        return <ClipboardList className="w-5 h-5" />;
      default:
        return <StickyNote className="w-5 h-5" />;
    }
  };

  const getIconColor = {}

  return (
    <>
      <Tooltip>
        <TooltipTrigger>
          <div className={`inline-flex items-center gap-2 ${iconColor[iconType]}`}>
            {getSourceIcon(iconType)}
            {showType && iconType}
          </div>
        </TooltipTrigger>
        {showType === false && <TooltipContent>{iconType}</TooltipContent>}
      </Tooltip>
    </>
  );
};

export default DataSourceIcon;