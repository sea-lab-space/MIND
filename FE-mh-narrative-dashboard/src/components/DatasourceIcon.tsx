import { Watch, MessageSquare, StickyNote, ClipboardList } from "lucide-react";
import type { DatasourceIconType, DatasourceIconProps } from "../types/props";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {DatasourceIconTypes} from "../types/props";

const iconMap: Record<DatasourceIconType, JSX.Element> = {
  [DatasourceIconTypes.passiveSensing]: <Watch className="w-5 h-5" />,
  [DatasourceIconTypes.clinicalTranscripts]: <MessageSquare className="w-5 h-5" />,
  [DatasourceIconTypes.clinicalNotes]: <StickyNote className="w-5 h-5" />,
  [DatasourceIconTypes.measurementScore]: <ClipboardList className="w-5 h-5" />
};

const iconColorMap: Record<DatasourceIconType, string> = {
  [DatasourceIconTypes.passiveSensing]: "text-slate-500",
  [DatasourceIconTypes.clinicalTranscripts]: "text-emerald-500",
  [DatasourceIconTypes.clinicalNotes]: "text-orange-500",
  [DatasourceIconTypes.measurementScore]: "text-yellow-500"
};

const DataSourceIcon: React.FC<DatasourceIconProps> = ({ iconType, showType = false }) => {
  const icon = iconMap[iconType] ?? <StickyNote className="w-5 h-5" />;
  const color = iconColorMap[iconType] ?? "text-gray-400";

  return (
      <Tooltip>
        <TooltipTrigger>
          <div className={`inline-flex items-center gap-2 ${color}`}>
            {icon}
            {showType && iconType}
          </div>
        </TooltipTrigger>
        {!showType && <TooltipContent>{iconType}</TooltipContent>}
      </Tooltip>
  );
};

export default DataSourceIcon;