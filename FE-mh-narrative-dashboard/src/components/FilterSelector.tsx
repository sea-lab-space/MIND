import {
    BedDouble,
    Activity,
    PhoneCall,
    Brain,
    Users2,
    Pill,
    Filter
} from "lucide-react"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { InsightType } from "@/types/props";


const InsightTypeMeta: Record<InsightType, {
    label: string;
    icon: React.ElementType;         // component reference
    iconNode?: React.ReactNode;      // pre-rendered JSX if needed
}> = {
    [InsightType.SLEEP]: {
        label: "Sleep Patterns",
        icon: BedDouble,
        iconNode: <BedDouble className="w-4 h-4 mr-2" />
    },
    [InsightType.ACTIVITY]: {
        label: "Physical Activity",
        icon: Activity,
        iconNode: <Activity className="w-4 h-4 mr-2" />
    },
    [InsightType.DIGITAL]: {
        label: "Digital Engagement",
        icon: PhoneCall,
        iconNode: <PhoneCall className="w-4 h-4 mr-2" />
    },
    [InsightType.EMOTIONAL]: {
        label: "Emotional State",
        icon: Brain,
        iconNode: <Brain className="w-4 h-4 mr-2" />
    },
    [InsightType.SOCIAL]: {
        label: "Social Interaction",
        icon: Users2,
        iconNode: <Users2 className="w-4 h-4 mr-2" />
    },
    [InsightType.MEDICATION]: {
        label: "Medication & Treatment",
        icon: Pill,
        iconNode: <Pill className="w-4 h-4 mr-2" />
    }
};



const FILTER_OPTIONS = Object.entries(InsightTypeMeta).map(([type, meta]) => ({
    type: type as InsightType,
    label: meta.label,
    icon: meta.iconNode
}));

type FilterSelectorProps = {
    selected: InsightType[];
    onToggle: (type: InsightType) => void;
};

export function FilterSelector({ selected, onToggle }: FilterSelectorProps) {
    return (
        <div className="flex items-center gap-4 flex-wrap mx-6 mt-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Filter className="w-4 h-4" />
                <span>Filter By:</span>
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
                            ? "bg-gray-200 text-black hover:bg-gray-200"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                    )}
                >
                    {icon}
                    {label}
                </Button>
            ))}
        </div>
    );
}
