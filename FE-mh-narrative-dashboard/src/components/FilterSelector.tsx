import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
    BedDouble,
    Activity,
    PhoneCall,
    Brain,
    Users2,
    Pill,
    Filter
} from "lucide-react"

type FilterKey =
    | "sleep"
    | "activity"
    | "digital"
    | "emotional"
    | "social"
    | "meds"

type FilterOption = {
    key: FilterKey
    label: string
    icon: React.ReactNode
}

const FILTER_OPTIONS: FilterOption[] = [
    {
        key: "sleep",
        label: "Sleep Patterns",
        icon: <BedDouble className="w-4 h-4 mr-2" />
    },
    {
        key: "activity",
        label: "Physical Activity",
        icon: <Activity className="w-4 h-4 mr-2" />
    },
    {
        key: "digital",
        label: "Digital Engagement",
        icon: <PhoneCall className="w-4 h-4 mr-2" />
    },
    {
        key: "emotional",
        label: "Emotional State",
        icon: <Brain className="w-4 h-4 mr-2" />
    },
    {
        key: "social",
        label: "Social Interaction",
        icon: <Users2 className="w-4 h-4 mr-2" />
    },
    {
        key: "meds",
        label: "Medication & Treatment",
        icon: <Pill className="w-4 h-4 mr-2" />
    }
]

export function FilterSelector() {
    const [selected, setSelected] = useState<FilterKey[]>([])

    const toggleFilter = (key: FilterKey) => {
        setSelected(prev =>
            prev.includes(key)
                ? prev.filter(k => k !== key)
                : [...prev, key]
        )
    }

    return (
        <div className="flex items-center gap-4 flex-wrap mx-6 mt-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Filter className="w-4 h-4" />
                <span>Filter By:</span>
            </div>
            {FILTER_OPTIONS.map(({ key, label, icon }) => (
                <Button
                    key={key}
                    variant="outline"
                    size="sm"
                    onClick={() => toggleFilter(key)}
                    className={cn(
                        "flex items-center rounded-2 transition-colors",
                        selected.includes(key)
                            ? "bg-gray-200 text-black hover:bg-gray-200"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                    )}
                >
                    {icon}
                    {label}
                </Button>
            ))}
        </div>
    )
}
