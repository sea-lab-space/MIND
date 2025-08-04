import { Watch, MessageSquare, StickyNote, ClipboardList } from "lucide-react";
import type { DatasourceIconType, DatasourceIconProps } from "../types/props";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DatasourceIconTypes } from "../types/props";
import { capitalizeFirst } from "@/utils/helper";

const dataSourceIconConfig: Record<DatasourceIconType, { icon: JSX.Element; color: string }> = {
  [DatasourceIconTypes.passiveSensing]: {
    icon: <Watch className="w-5 h-5" />,
    color: "text-slate-500"
  },
  [DatasourceIconTypes.clinicalTranscripts]: {
    icon: <MessageSquare className="w-5 h-5" />,
    color: "text-emerald-500"
  },
  [DatasourceIconTypes.clinicalNotes]: {
    icon: <StickyNote className="w-5 h-5" />,
    color: "text-orange-500"
  },
  [DatasourceIconTypes.measurementScore]: {
    icon: <ClipboardList className="w-5 h-5" />,
    color: "text-yellow-500"
  }
};

const fallback = {
  icon: <StickyNote className="w-5 h-5" />,
  color: "text-gray-400"
};

const DataSourceIcon: React.FC<DatasourceIconProps> = ({ iconType, showType = false }) => {
  const { icon, color } = dataSourceIconConfig[iconType] ?? fallback;

  return (
    <Tooltip>
      <TooltipTrigger>
        <div className={`inline-flex items-center gap-2 ${color}`}>
          {icon}
          {showType && capitalizeFirst(iconType)}
        </div>
      </TooltipTrigger>
      {!showType && (
        <TooltipContent>{capitalizeFirst(iconType)}</TooltipContent>
      )}
    </Tooltip>
  );
};

export default DataSourceIcon;
