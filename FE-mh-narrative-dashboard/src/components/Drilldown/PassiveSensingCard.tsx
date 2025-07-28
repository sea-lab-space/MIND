import {useEffect, useState} from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type {InsightCard} from "@/types/dataTypes";
import InsightGraph from "@/components/DataInsights/InsightGraph";
import {shouldShowChart} from "@/utils/helper";

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
    const factsData = insightData.expandView;
    const [selectedKey, setSelectedKey] = useState<string | null>(null);
    const selectedInsight = factsData.find((fact) => fact.key === selectedKey);

    useEffect(() => {
        if (factsData.length > 0 && !selectedKey) {
            setSelectedKey(factsData[0].key);
        }
    }, [insightData]);

    if (!selectedInsight) {
        return (
            <Card className="bg-white border-[#eaeaea]">
                <CardHeader className="pb-4">
                    <span className="text-[#757575] font-medium">Passive Sensing Data</span>
                </CardHeader>
                <CardContent>
                    <div className="text-gray-500 text-sm">Loading insight data...</div>
                </CardContent>
            </Card>
        );
    }

    const showChart = shouldShowChart(selectedInsight.dataSourceType, selectedInsight.dataPoints);
    console.log(selectedInsight, "printing correct one", selectedInsight.dataSourceType, showChart)

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
                        {factsData.map((insight) => (
                            <Button
                                key={insight.key}
                                variant="outline"
                                onClick={() => setSelectedKey(insight.key)}
                                className={`w-full justify-start h-auto text-left whitespace-normal p-4 text-sm text-[#1e1e1e] border-[#d9d9d9] ${
                                    selectedKey === insight.key ? "bg-[#f7f5f5]" : "bg-white"
                                }`}
                            >
                                <div className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-gray-600 rounded-full mt-2 flex-shrink-0"></div>
                                    <span>
                {insight.summarySentence}
            </span>
                                </div>
                            </Button>
                        ))}
                    </div>

                    {/* Right Chart */}
                    <div className="bg-red-100 flex items-center justify-center">
                        <div className="h-64 w-120">
                            {showChart && selectedInsight && (
                                <InsightGraph
                                    dataSourceType={selectedInsight.dataSourceType}
                                    data={selectedInsight.dataPoints}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default PassiveSensingCard;
