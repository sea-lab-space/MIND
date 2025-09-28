import {
    Brain,
    Users2,
    Pill,
    Filter, Activity
} from "lucide-react"
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { InsightType } from "@/types/props";

const InsightTypeMeta: Record<
  InsightType,
  {
    label: string;
    icon: React.ElementType;         // component reference
    iconNode?: React.ReactNode;      // pre-rendered JSX if needed
}> = {
      [InsightType.BIOLOGICAL]: {
        label: "Biological",
        icon: Activity,
        iconNode: <Activity className="w-4 h-4" />
    },  
  [InsightType.PSYCHOLOGICAL]: {
        label: "Psychological",
        icon: Brain,
        iconNode: <Brain className="w-4 h-4" />
    },
    [InsightType.SOCIAL]: {
        label: "Social",
        icon: Users2,
        iconNode: <Users2 className="w-4 h-4" />
    },

};


const FILTER_OPTIONS = Object.entries(InsightTypeMeta).map(([type, meta]) => ({
    type: type as InsightType,
    label: meta.label,
    icon: meta.iconNode
}));

type FilterSelectorProps = {
    selected: InsightType[];
    onToggle: (type: InsightType) => void;
    selectedPatient: string;
};

export function FilterSelector({ selected, onToggle, selectedPatient }: FilterSelectorProps) {
    const patientName = selectedPatient
    return (
      <div className="flex justify-between items-center gap-1 sticky top-8 z-10 bg-white mb-1">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="w-4 h-4" />
            <span>{selected?.length? 'Insight category:' : 'All category:' }</span>
          </div>

          {FILTER_OPTIONS.map(({ type, label, icon }) => (
            <Button
              key={type}
              variant="outline"
              size="sm"
              onClick={() => onToggle(type)}
              className={cn(
                  "flex items-center rounded-2 transition-colors",
                  selected.includes(type)
                      ? "bg-gray-700 text-white hover:bg-gray-500 hover:text-white"
                      : "bg-white text-gray-700 hover:bg-gray-500 hover:text-white"
              )}
            >
              {icon}
              {label}
            </Button>
          ))}
        </div>
      </div>
    );
}
