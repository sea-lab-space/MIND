import { useState } from "react"
import { Watch, MessageSquare, StickyNote } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import InsightCardDetail from "@/components/InsightCardDetails"

interface InsightCardProps {
    isExpanded?: boolean
    title?: string
    sources?: Array<{
        type: "passive-sensing" | "clinical-notes" | "patient-data"
    }>
    onToggle?: (expanded: boolean) => void
    isSelected?: boolean
    onSelect?: () => void
}

export default function InsightCardComponent({
                                                 isExpanded = false,
                                                 title = "Growing Activity Level Despite Persistent Fatigue",
                                                 sources = [
                                                     { type: "passive-sensing" },
                                                     { type: "clinical-notes" },
                                                     { type: "patient-data" }
                                                 ],
                                                 onToggle,
                                                 isSelected = true,
                                                 onSelect
                                             }: InsightCardProps) {
    const [detailExpanded, setDetailExpanded] = useState(isExpanded)

    const getSourceIcon = (type: string) => {
        switch (type) {
            case "passive-sensing":
                return <Watch className="w-5 h-5 text-slate-500" />
            case "clinical-notes":
                return <MessageSquare className="w-5 h-5 text-green-500" />
            case "patient-data":
                return <StickyNote className="w-5 h-5 text-orange-500" />
            default:
                return <StickyNote className="w-5 h-5 text-gray-500" />
        }
    }

    return (
        <Card className="w-full max-w-[700px] transition-all duration-200 hover:shadow-md border border-gray-200 bg-white text-left">
            <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                    <div
                        className="relative w-5 h-5 min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px] cursor-pointer mt-[5px]"
                        onClick={(e) => {
                            e.stopPropagation()
                            onSelect?.()
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
                    <h2 className="text-2xl font-bold text-gray-900 leading-tight">{title}</h2>
                </div>
            </CardHeader>


            {detailExpanded && (
                <CardContent className="pt-0 space-y-6 text-left">
                    <InsightCardDetail />
                </CardContent>
            )}

            <div className="flex items-center gap-2 pt-4 pl-5 text-left justify-start">
                <span className="text-sm font-medium italic">Sources:</span>
                <div className="flex items-center gap-3 ml-3">
                    {sources.map((source, index) => (
                        <div key={index} className="flex items-center">
                            {getSourceIcon(source.type)}
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    )
}
