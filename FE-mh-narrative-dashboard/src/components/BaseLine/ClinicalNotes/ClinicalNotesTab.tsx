import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import OverviewSummary from "@/components/BaseLine/OverciewSummary";
import ReactMarkdown from "react-markdown";
import type {Encounter} from "@/types/dataTypes";
import type { OverviewSpec } from "@/types/insightSpec";

interface ClinicalNotesTabProps {
  showOverviewCardData?: boolean;
  overviewCardData?: OverviewSpec;
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
            setSelectedDate(dates[dates.length - 1]);
        }
    }, [dates, selectedDate]);

    const selectedFact = clinicalNotesFacts?.find(
        (fact) => fact.encounter_date === selectedDate
    );

    return (
      <div className="flex gap-4 h-full py-2 px-4">
        <div className="w-[240px] h-full shrink-0 sticky top-0 z-10">
          {showOverviewCardData && overviewCardData && (
            <OverviewSummary overviewCardData={overviewCardData} />
          )}

          <div
            className={`flex flex-col gap-2 shrink-0 sticky top-0 z-10 ${
              showOverviewCardData ? "mt-8" : ""
            }`}
          >
            {dates?.map((date) => {
              const isSelected = selectedDate === date;
              const baseClasses =
                "px-4 py-2 text-sm border-[#d9d9d9] text-left";
              const selectedBorder = "border-2 border-[#1e1e1e]";

              return (
                <Button
                  key={date}
                  variant="outline"
                  onClick={() => setSelectedDate(date)}
                  className={`${baseClasses} bg-white ${
                    isSelected ? selectedBorder : ""
                  }`}
                >
                  {date}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto h-full p-4 bg-gray-50 border rounded-xl shadow">
          <h2 className="text-lg font-semibold">Clinical Notes</h2>
          <p className="text-sm text-muted-foreground mb-4">
            {selectedDate ? `Date: ${selectedDate}` : "No date selected"}
          </p>

          {selectedFact?.clinical_note ? (
            <ReactMarkdown>{selectedFact.clinical_note}</ReactMarkdown>
          ) : (
            <p className="text-sm text-gray-500">
              No record available for this date.
            </p>
          )}
        </div>
      </div>
    );
};

export default ClinicalNotesTab;
