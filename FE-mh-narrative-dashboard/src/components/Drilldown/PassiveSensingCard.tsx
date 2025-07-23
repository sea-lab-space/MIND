import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type {InsightCard} from "@/types/dataTypes";

const chartData = [
    { value: 0.8, type: "history" },
    { value: 1.2, type: "history" },
    { value: 1.5, type: "history" },
    { value: 0.9, type: "history" },
    { value: 1.1, type: "history" },
    { value: 1.3, type: "history" },
    { value: 1.8, type: "history" },
    { value: 2.1, type: "retrospective" },
    { value: 2.8, type: "retrospective" },
    { value: 3.2, type: "retrospective" },
    { value: 2.9, type: "retrospective" },
    { value: 3.5, type: "retrospective" },
    { value: 3.8, type: "retrospective" },
    { value: 4.2, type: "retrospective" },
    { value: 3.9, type: "retrospective" },
    { value: 4.1, type: "retrospective" },
];

const maxValue = Math.max(...chartData.map((d) => d.value));

interface PassiveSensingCardProps {
    insightData: InsightCard;
}

const PassiveSensingCard = ({
                                insightData
                            }) => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const factsData = insightData.expandView;
    console.log(insightData.expandView)

    const insights = [
        {
            title: "Outbound phone communication",
            detail: "increased to 4-5 calls/texts daily",
        },
        {
            title: "Outings to Social Hubs",
            detail: "remains similar to before",
        },
    ];

    return (
        <Card className="bg-white border-[#eaeaea]">
            <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#626681]" />
                    <span className="text-[#757575] font-medium">Passive Sensing Data</span>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex gap-6">
                    {/* Left Buttons */}
                    <div className="flex-shrink-0 space-y-4 w-80">
                        {factsData.map((insight, index) => (
                            <Button
                                key={index}
                                variant="outline"
                                onClick={() => setSelectedIndex(index)}
                                className={`w-full justify-start h-auto text-left whitespace-normal p-4 text-sm text-[#1e1e1e] border-[#d9d9d9] ${
                                    selectedIndex === index ? "bg-[#f7f5f5]" : "bg-white"
                                }`}
                            >
                                <div className="flex items-start gap-2">
                                    <div className="w-2 h-2 rounded-full bg-[#757575] mt-2" />
                                    <span>
                                        {/*<strong>{insight.summarySentence}</strong> {insight.detail}*/}
                                        {insight.summarySentence}
                                    </span>
                                </div>
                            </Button>
                        ))}
                    </div>

                    {/* Right Chart */}
                    <div className="flex-1">
                        <div className="relative h-64">
                            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-[#be123c] font-medium">
                                <span>4.68</span>
                                <span>1.25</span>
                            </div>
                            <div className="ml-12 h-full relative">
                                <div className="absolute w-full border-t border-dashed border-[#be123c] opacity-50" style={{ top: "20%" }} />
                                <div className="absolute w-full border-t border-dashed border-[#be123c] opacity-50" style={{ top: "80%" }} />
                                <div className="flex items-end justify-between h-full pb-8">
                                    {chartData.map((item, index) => (
                                        <div
                                            key={index}
                                            className={`w-4 rounded-t ${item.type === "history" ? "bg-[#b2b2b2]" : "bg-[#626681]"}`}
                                            style={{ height: `${(item.value / maxValue) * 80}%` }}
                                        />
                                    ))}
                                </div>
                                <div className="absolute bottom-0 w-full flex justify-between text-xs text-[#757575]">
                                    <span>history</span>
                                    <span>retrospective</span>
                                    <span>Time</span>
                                </div>
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-[#757575] origin-center">
                                    calls/day
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default PassiveSensingCard;
