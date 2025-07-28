import {useEffect, useState} from "react";
import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type {InsightExpandView} from "@/types/dataTypes";
import {formatDate} from "@/utils/helper";


// Background color by relevance
const getColorByRelevance = (relevance: number) => {
    if (relevance > 0.8) return "bg-[#4d7c0f]"; // dark green
    if (relevance > 0.5) return "bg-[#9fb40f]"; // medium green
    return "bg-[#d9b238]"; // yellow-green
};

interface clinicalTranscriptsFactsProps {
    clinicalTranscriptsFacts: InsightExpandView[];
}

const TranscriptCard = ({clinicalTranscriptsFacts} : clinicalTranscriptsFactsProps) => {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedFactKey, setSelectedFactKey] = useState<string | null>(null);

    useEffect(() => {
        if (clinicalTranscriptsFacts.length > 0) {
            setSelectedFactKey(clinicalTranscriptsFacts[0].key);
        } else {
            setSelectedFactKey(null);
        }
    }, [clinicalTranscriptsFacts]);

    // Find selected fact based on selectedFactKey
    const selectedFact = clinicalTranscriptsFacts.find(fact => fact.key === selectedFactKey);
    const dates = selectedFact?.dataPoints?.map(fact => fact.date);

    useEffect(() => {
        if (dates && dates.length > 0 && !selectedDate) {
            setSelectedDate(dates[0]);
        }
    }, [dates, selectedDate]);

    return (
        <Card className="bg-white border-[#eaeaea]">
            <CardContent className="px-6">
                {/* Header */}
                <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-4 h-4 text-[#ffc100]" />
                    <span className="text-[#ffc100] font-medium">Clinical Notes</span>
                </div>

                {/* Date buttons on top */}
                <div className="flex gap-4 mb-6 overflow-x-auto no-scrollbar">
                    {dates?.map((date) => (
                        <Button
                            key={date}
                            variant="outline"
                            onClick={() => setSelectedDate(date)}
                            className={`whitespace-nowrap px-4 py-2 text-sm border-[#d9d9d9] ${
                                selectedDate === date ? "bg-[#f7f5f5] border-2 border-[#1e1e1e]" : "bg-white"
                            }`}
                        >
                            {formatDate(date)}
                        </Button>
                    ))}
                </div>

                <div className="flex gap-8">
                    {/* Left vertical buttons (summary sentences for selected date) */}
                    <div className="flex-shrink-0 space-y-4 w-80">
                        {clinicalTranscriptsFacts.map((fact) => (
                            <Button
                                key={fact.key}
                                variant="outline"
                                onClick={() => setSelectedFactKey(fact.key)}
                                className={`w-full justify-start h-auto text-left whitespace-normal p-4 text-sm border-[#d9d9d9] ${
                                    selectedFactKey === fact.key ? "bg-[#f7f5f5]" : "bg-white"
                                }`}
                            >
                                <div className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-gray-600 rounded-full mt-2 flex-shrink-0" />
                                    <span>{fact.summarySentence}</span>
                                </div>
                            </Button>
                        ))}
                    </div>

                    {/* Right side: selected fact details */}
                    <div
                        className="space-y-6 text-sm text-[#2c2c2c] overflow-y-auto"
                        style={{ flex: 1, maxHeight: "500px" /* match container height */, paddingRight: "1rem" }}
                    >
                        {selectedFact?.dataPoints
                            ?.filter(dp => dp.date === selectedDate)
                            .map((dp, index) => (
                                <div key={index} className="space-y-1">
                                    <div className="prose prose-sm max-w-none text-[#2c2c2c]">
                                        {dp.record?.map((recordInfo, i) => (
                                            <div key={i} className="mb-4 space-y-2">
                                                {Object.keys(recordInfo).map((key) => (
                                                    <div key={key}>
                                                        <strong className="block capitalize">{key}:</strong>
                                                        <p>{recordInfo[key]}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
export default TranscriptCard;
