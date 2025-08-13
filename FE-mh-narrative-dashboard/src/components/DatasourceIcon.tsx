import { Watch, MessageSquare, StickyNote, ClipboardList, FileWarningIcon } from "lucide-react";
import type { DatasourceIconType, DatasourceIconProps } from "../types/props";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DatasourceIconTypes } from "../types/props";
import { capitalizeFirst } from "@/utils/helper";
import type { JSX } from "react";

const dataSourceIconConfig: Record<DatasourceIconType, { icon: JSX.Element; color: string; displayName: string }> = {
  [DatasourceIconTypes.passiveSensing]: {
    icon: <Watch className="w-5 h-5" />,
    color: "text-slate-500",
    displayName: "Passive sensing"
  },
  [DatasourceIconTypes.clinicalTranscripts]: {
    icon: <MessageSquare className="w-5 h-5" />,
    color: "text-emerald-500",
    displayName: "Transcripts"
  },
  [DatasourceIconTypes.clinicalNotes]: {
    icon: <StickyNote className="w-5 h-5" />,
    color: "text-yellow-500",
    displayName: "Clinical notes"
  },
  [DatasourceIconTypes.surveyScore]: {
    icon: <ClipboardList className="w-5 h-5" />,
    color:  "text-orange-500",
    displayName: "Survey scores"
  }
};

const fallback = {
  icon: <FileWarningIcon className="w-5 h-5" />,
  color: "text-black-400",
  displayName: "Unknown"
};

const DataSourceIcon: React.FC<DatasourceIconProps> = ({ iconType, showType = false, forcePlainColor = false, textPlainColor = false }) => {
  const { icon, color, displayName } = dataSourceIconConfig[iconType] ?? fallback;
  const colorDisplay = forcePlainColor ? fallback.color : color;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={`flex items-center justify-center gap-2 ${colorDisplay}`}
        >
          {icon}
          {textPlainColor ? (
            <span className="text-black">{capitalizeFirst(displayName)}</span>
          ) : (
            showType && capitalizeFirst(displayName)
          )}
        </div>
      </TooltipTrigger>
      {!showType && (
        <TooltipContent>{capitalizeFirst(displayName)}</TooltipContent>
      )}
    </Tooltip>
  );
};

export default DataSourceIcon;
