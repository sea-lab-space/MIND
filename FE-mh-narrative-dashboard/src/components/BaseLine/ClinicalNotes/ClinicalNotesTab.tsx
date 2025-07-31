import OverviewSummary from "@/components/BaseLine/OverciewSummary";
import OverviewComponent from "@/components/Overview/OverviewComponent";
import {useEffect, useState} from "react";

const ClinicalNotesTab = ({ overviewCardData, insightCardData }) => {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedFactKey, setSelectedFactKey] = useState<string | null>(null);
    //
    // useEffect(() => {
    //     if (clinicalNotesFacts.length > 0) {
    //         setSelectedFactKey(clinicalNotesFacts[0].key);
    //     } else {
    //         setSelectedFactKey(null);
    //     }
    // }, [clinicalNotesFacts]);
    //
    // // Find selected fact based on selectedFactKey
    // const selectedFact = clinicalNotesFacts.find(fact => fact.key === selectedFactKey);
    // const selectedFactSpec = selectedFact?.highlightSpec;
    // const dates = selectedFact?.dataPoints?.map(fact => fact.date);
    // const highlightDates = new Set(
    //     (Array.isArray(selectedFact?.highlightSpec) ? selectedFact?.highlightSpec : [])
    //         .map(spec => spec?.date)
    // );
    //
    //
    // useEffect(() => {
    //     if (dates && dates.length > 0 && !selectedDate) {
    //         setSelectedDate(dates[0]);
    //     }
    // }, [dates, selectedDate]);

    return (
        <div className="flex gap-4 h-full">
            <div className="w-[260px] shrink-0 h-full overflow-y-auto">
                <OverviewSummary basicInfoCardData={overviewCardData} />
            </div>

            {/* Right Content */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 border rounded-xl shadow">
                <h2 className="text-lg font-semibold">Chart Review</h2>
                {/* Use insightCardData here */}
                <p className="mt-2 text-sm text-muted-foreground">
                    Chart insights and timeline here.
                </p>
            </div>
        </div>
    );
};

export default ClinicalNotesTab;
