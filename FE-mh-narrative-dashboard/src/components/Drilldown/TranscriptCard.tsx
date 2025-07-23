import { useState } from "react";
import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Sample transcript data
const transcriptData = [
    {
        date: "2025-07-23",
        relevance: 0.9,
        lines: [
            {
                speaker: "Patient (John Doe)",
                content:
                    "Honestly, it's still pretty quiet. I mostly just talk to my sister. She calls me, or I'll text her back. Sometimes I even call her first, which is new for me, so that feels like something.",
            },
            {
                speaker: "Psychiatrist (Dr. R)",
                content:
                    "Thanks for sharing that. You mentioned calling your sister first sometimes, and that's a new thing for you. Can you tell me a little more about what that's like?",
            },
        ],
    },
    {
        date: "2025-07-10",
        relevance: 0.6,
        lines: [
            {
                speaker: "Patient (John Doe)",
                content:
                    "I haven’t really spoken to anyone. It’s just been a lot lately, and I feel like avoiding everyone.",
            },
            {
                speaker: "Psychiatrist (Dr. R)",
                content:
                    "It sounds like you’ve needed some space. Have you noticed any patterns in when you feel this way?",
            },
        ],
    },
    {
        date: "2025-07-01",
        relevance: 0.4,
        lines: [
            {
                speaker: "Patient (John Doe)",
                content:
                    "Sometimes I just want to be left alone, but I also feel lonely. It’s confusing.",
            },
            {
                speaker: "Psychiatrist (Dr. R)",
                content:
                    "Those mixed feelings are valid. Let's explore where that confusion might be coming from.",
            },
        ],
    },
];

// Format date
const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

// Background color by relevance
const getColorByRelevance = (relevance: number) => {
    if (relevance > 0.8) return "bg-[#4d7c0f]"; // dark green
    if (relevance > 0.5) return "bg-[#9fb40f]"; // medium green
    return "bg-[#d9b238]"; // yellow-green
};

const TranscriptCard = () => {
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const selectedTranscript = transcriptData[selectedIndex];

    return (
        <Card className="bg-white border-[#eaeaea]">
            <CardContent className="px-6">
                <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#9fb40f]" />
                    <span className="text-[#9fb40f] font-medium">Transcript</span>
                </div>
                <div className="text-xs text-[#757575]">*Color hue indicates relevance</div>
                <div className="flex gap-8">
                    {/* Left: Date Buttons */}
                    <div className="space-y-2 w-64 flex-shrink-0">
                        {transcriptData.map((entry, index) => {
                            const isSelected = selectedIndex === index;
                            const bgColor = getColorByRelevance(entry.relevance);
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
                                        <span>{formatDate(entry.date)}</span>
                                    </div>
                                </Button>
                            );
                        })}
                    </div>

                    {/* Right: Transcript Content */}
                    <div className="space-y-4 text-sm text-[#2c2c2c]">
                        {selectedTranscript.lines.map((line, idx) => (
                            <div key={idx}>
                                <strong className="text-[#1e1e1e]">{line.speaker}:</strong>
                                <p className="mt-1">{line.content}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default TranscriptCard;
