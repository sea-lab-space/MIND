import { useState } from "react";
import { ClipboardList } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Example data with notes
const clinicalFactsData = [
    {
        date: "2025-07-23",
        relevance: 0.9,
        subjective: `Patient reports improved mood. Spoke with his sister twice this week.`,
        objective: `Affect brighter. More engaged during session.`,
    },
    {
        date: "2025-07-15",
        relevance: 0.6,
        subjective: `Patient describes feeling isolated. Avoiding calls.`,
        objective: `Flat affect. Minimal eye contact.`,
    },
    {
        date: "2025-07-05",
        relevance: 0.3,
        subjective: `Limited social interactions. Feeling “stuck.”`,
        objective: `Affect restricted. Slower speech.`,
    },
];

// Format date
const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

// Background color based on relevance
const getColorByRelevance = (relevance: number, selected: boolean) => {
    if (selected) return "bg-[#c3dafe]";
    if (relevance > 0.8) return "bg-[#ffe3b3]";
    if (relevance > 0.5) return "bg-[#fff1cc]";
    return "bg-[#fff9e6]";
};

const ClinicalNotesCard = () => {
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const selectedNote = clinicalFactsData[selectedIndex];

    return (
        <Card className="bg-white border-[#eaeaea]">
            <CardContent className="px-6">
                <div className="flex items-center gap-2 mb-4">
                    <ClipboardList className="w-4 h-4 text-[#ffc100]" />
                    <span className="text-[#ffc100] font-medium">Clinical Notes</span>
                </div>

                <div className="flex gap-8">
                    {/* Left: Date Buttons */}
                    <div className="space-y-2 w-64 flex-shrink-0">
                        {clinicalFactsData.map((insight, index) => {
                            const isSelected = selectedIndex === index;
                            const bgColor = getColorByRelevance(insight.relevance, false); // no special bg for selected
                            return (
                                <Button
                                    key={index}
                                    variant="outline"
                                    onClick={() => setSelectedIndex(index)}
                                    className={`w-full justify-start text-left whitespace-normal p-4 text-sm text-[#1e1e1e] border ${
                                        isSelected ? "border-2 border-[#1e1e1e]" : "border border-[#d9d9d9]"
                                    } ${bgColor}`}
                                >
                                    <div className="flex items-start gap-2">
                                        <div className="w-2 h-2 rounded-full bg-[#757575] mt-2" />
                                        <span>{formatDate(insight.date)}</span>
                                    </div>
                                </Button>
                            );
                        })}

                    </div>

                    {/* Right: Notes */}
                    <div className="space-y-6 text-sm text-[#2c2c2c]">
                        <div>
                            <strong className="text-[#1e1e1e]">SUBJECTIVE:</strong>
                            <p className="mt-1">{selectedNote.subjective}</p>
                        </div>
                        <div>
                            <strong className="text-[#1e1e1e]">OBJECTIVE:</strong>
                            <ul className="mt-1 space-y-1 list-disc list-inside">
                                <li>{selectedNote.objective}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ClinicalNotesCard;
