import { Lightbulb } from "lucide-react";
import {Card, CardContent} from "@/components/ui/card";


interface PatientInsightHeaderCardProps {
    insights?: string[];
}

function PatientInsightHeaderCard({ insights=[] }: PatientInsightHeaderCardProps) {
    return (
        <Card className="border border-gray-200 w-full">
            <CardContent className="p-6">
                <div className="flex items-start gap-3">
                    <Lightbulb className="text-yellow-500 mt-1" size={20} />
                    <div>
                        <h3 className="font-semibold text-black text-base">
                            Selected Patient-facing Data Insights
                        </h3>
                        <p className="text-sm text-gray-500 italic mb-3">
                            * Toggle selection from Data Insight Collection to include and exclude insights
                        </p>
                        <ul className="list-disc pl-5 text-sm text-black space-y-1">
                            {insights.map((insight, index) => (
                                <li key={index}>{insight}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default PatientInsightHeaderCard;