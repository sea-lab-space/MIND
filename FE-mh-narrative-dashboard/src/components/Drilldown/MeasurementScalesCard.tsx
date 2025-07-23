import { useState } from "react";
import { BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const MeasurementScalesCard = () => {
    const [selectedScale, setSelectedScale] = useState("PHQ-9");

    const graphData = {
        "PHQ-9": {
            points: "0,80 50,60 100,70 150,50 200,65 250,45 300,40 350,55 400,35 450,50",
            yValues: [80, 60, 70, 50, 65, 45, 40, 55, 35, 50],
        },
        "MADRS": {
            points: "0,70 50,65 100,60 150,55 200,50 250,45 300,40 350,35 400,30 450,25",
            yValues: [70, 65, 60, 55, 50, 45, 40, 35, 30, 25],
        },
    };

    const currentGraph = graphData[selectedScale];

    return (
        <Card className="bg-white border-[#eaeaea]">
            <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#fb923c]" />
                    <span className="text-[#fb923c] font-medium">Measurement Scales</span>
                </div>
                <div className="text-sm text-[#1e1e1e] font-medium mt-2">Relevant Context</div>
            </CardHeader>
            <CardContent>
                <div className="flex gap-6">
                    <div className="flex-shrink-0 space-y-2 w-48">
                        {["PHQ-9", "MADRS"].map((label) => {
                            const isSelected = selectedScale === label;
                            return (
                                <Button
                                    key={label}
                                    variant="ghost"
                                    onClick={() => setSelectedScale(label)}
                                    className={`w-full justify-start border border-[#d9d9d9] text-sm ${
                                        isSelected ? "bg-[#f7f5f5]" : "bg-white"
                                    } hover:bg-[#f7f5f5]`}
                                >
                                    <div className="flex items-center gap-2 text-[#1e1e1e]">
                                        <div className="w-2 h-2 rounded-full bg-[#fb923c]" />
                                        {label}
                                    </div>
                                </Button>
                            );
                        })}
                    </div>
                    <div className="flex-1">
                        <div className="relative h-48">
                            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-[#be123c] font-medium">
                                <span>{selectedScale}</span>
                                <span>23</span>
                                <span>11</span>
                            </div>
                            <div className="absolute top-0 right-20 flex gap-2">
                                {["Q1", "Q2"].map((q) => (
                                    <Badge key={q} variant="outline" className="text-[#fb923c] border-[#fb923c]">
                                        {q}
                                    </Badge>
                                ))}
                            </div>
                            <div className="ml-12 h-full relative">
                                <div className="absolute bottom-8 w-full h-16 bg-[#eaeaea] opacity-50 rounded" />
                                <svg className="absolute bottom-8 w-full h-32">
                                    <polyline
                                        fill="none"
                                        stroke="#fb923c"
                                        strokeWidth="2"
                                        points={currentGraph.points}
                                    />
                                    {currentGraph.yValues.map((y, i) => (
                                        <circle key={i} cx={i * 50} cy={y} r="3" fill="#fb923c" />
                                    ))}
                                </svg>
                                <div className="absolute bottom-8 left-3/4 w-px h-32 border-l border-dashed border-[#757575]" />
                                <div className="absolute bottom-0 w-full flex justify-between text-xs text-[#757575]">
                                    <span>history</span>
                                    <span>retrospective</span>
                                    <span>Time</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default MeasurementScalesCard;
