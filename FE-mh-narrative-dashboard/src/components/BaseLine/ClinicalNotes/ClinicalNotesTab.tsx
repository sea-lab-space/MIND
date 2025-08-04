import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import OverviewSummary from "@/components/BaseLine/OverciewSummary";
import ReactMarkdown from "react-markdown";
import type {Encounter} from "@/types/dataTypes";

interface ClinicalNotesTabProps {
    showOverviewCardData?: boolean,
    overviewCardData: Record<string, string>;
    clinicalNotesFacts: Encounter[];
}

const ClinicalNotesTab: React.FC<ClinicalNotesTabProps> = ({
                                                               showOverviewCardData=true,
                                                               overviewCardData,
                                                               clinicalNotesFacts,
                                                           }) => {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const dates = clinicalNotesFacts?.map((fact) => fact.encounter_date);

    useEffect(() => {
        if (dates && dates.length > 0 && !selectedDate) {
            setSelectedDate(dates[0]);
        }
    }, [dates, selectedDate]);

    // Get the record for the selected date
    const selectedFact = clinicalNotesFacts?.find(
        (fact) => fact.encounter_date === selectedDate
    );

    return (
        <div className="flex gap-4">
            {/* Sidebar: Overview + Date Buttons */}
            <div className="w-[260px] shrink-0 overflow-y-auto">
                {showOverviewCardData && <OverviewSummary basicInfoCardData={overviewCardData} />}


                {/* Date selection buttons */}
                <div className="flex flex-col gap-2 mt-8">
                    {dates?.map((date) => {
                        const isSelected = selectedDate === date;
                        const baseClasses = "px-4 py-2 text-sm border-[#d9d9d9] text-left";
                        const selectedBorder = "border-2 border-[#1e1e1e]";

                        return (
                            <Button
                                key={date}
                                variant="outline"
                                onClick={() => setSelectedDate(date)}
                                className={`${baseClasses} bg-white ${isSelected ? selectedBorder : ""}`}
                            >
                                {date}
                            </Button>
                        );
                    })}
                </div>
            </div>

            {/* Main Content: Clinical Note Text */}
            <div className="flex-1 overflow-y-auto max-h-[750px] p-4 bg-gray-50 border rounded-xl shadow">
                <h2 className="text-lg font-semibold">Clinical Note</h2>
                <p className="text-sm text-muted-foreground mb-4">
                    {selectedDate ? `Date: ${selectedDate}` : "No date selected"}
                </p>

                {selectedFact?.clinical_note ? (
                    <ReactMarkdown>
                        {selectedFact.clinical_note}
                    </ReactMarkdown>
                ) : (
                    <p className="text-sm text-gray-500">No record available for this date.</p>
                )}
            </div>
        </div>
    );
};

export default ClinicalNotesTab;
