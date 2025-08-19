import {
    BedDouble,
    Activity,
    PhoneCall,
    Brain,
    Users2,
    Pill,
    Filter
} from "lucide-react"
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { InsightType } from "@/types/props";

// const InsightTypeMeta: Record<InsightType, {
//     label: string;
//     icon: React.ElementType;         // component reference
//     iconNode?: React.ReactNode;      // pre-rendered JSX if needed
// }> = {
//     [InsightType.SLEEP]: {
//         label: "Sleep Patterns",
//         icon: BedDouble,
//         iconNode: <BedDouble className="w-4 h-4" />
//     },
//     [InsightType.ACTIVITY]: {
//         label: "Physical Activity",
//         icon: Activity,
//         iconNode: <Activity className="w-4 h-4" />
//     },
//     [InsightType.DIGITAL]: {
//         label: "Digital Engagement",
//         icon: PhoneCall,
//         iconNode: <PhoneCall className="w-4 h-4" />
//     },
//     [InsightType.EMOTIONAL]: {
//         label: "Emotional State",
//         icon: Brain,
//         iconNode: <Brain className="w-4 h-4" />
//     },
//     [InsightType.SOCIAL]: {
//         label: "Social Interaction",
//         icon: Users2,
//         iconNode: <Users2 className="w-4 h-4" />
//     },
//     [InsightType.MEDICATION]: {
//         label: "Medication & Treatment",
//         icon: Pill,
//         iconNode: <Pill className="w-4 h-4" />
//     }
// };

const InsightTypeMeta: Record<
  InsightType,
  {
    label: string;
    icon: React.ElementType; // component reference
    iconNode?: React.ReactNode; // pre-rendered JSX if needed
  }
> = {
  [InsightType.BIO]: {
    label: "Biological",
    icon: BedDouble,
    iconNode: <BedDouble className="w-4 h-4" />,
  },
  [InsightType.PSY]: {
    label: "Psychological",
    icon: Activity,
    iconNode: <Activity className="w-4 h-4" />,
  },
  [InsightType.SOC]: {
    label: "Social",
    icon: PhoneCall,
    iconNode: <PhoneCall className="w-4 h-4" />,
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
        {/**mx-6 mt-2  */}
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
