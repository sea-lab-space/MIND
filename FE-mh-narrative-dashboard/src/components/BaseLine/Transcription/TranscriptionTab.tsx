import {useEffect, useState} from "react";
import OverviewSummary from "@/components/BaseLine/OverciewSummary";
import {Button} from "@/components/ui";
import type { Encounter, TranscriptEntry } from "@/types/dataTypes";
import type { OverviewSpec } from "@/types/insightSpec";

interface TranscriptionTabProps {
  showOverviewCardData?: boolean;
  overviewCardData?: OverviewSpec;
  clinicalTranscriptsFacts: Encounter[];
}

const TranscriptionTab: React.FC<TranscriptionTabProps> = ({
                                                               showOverviewCardData=true,
                                                               overviewCardData,
                                                               clinicalTranscriptsFacts,
                                                           }) => {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const dates = clinicalTranscriptsFacts?.map((fact) => fact.encounter_date);

    useEffect(() => {
        if (dates && dates.length > 0 && !selectedDate) {
            setSelectedDate(dates[dates.length - 1]);
        }
    }, [dates, selectedDate]);

    // Get the record for the selected date
    const selectedFact = clinicalTranscriptsFacts?.find(
        (fact) => fact.encounter_date === selectedDate
    );

    return (
      <div className="flex gap-4 h-full py-2 px-4">
        {/* Sidebar: Overview + Date Buttons */}
        <div className="w-[260px] shrink-0 h-full sticky top-0 z-10">
          {showOverviewCardData && overviewCardData && (
            <OverviewSummary overviewCardData={overviewCardData} />
          )}

          {/* Date selection buttons */}
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

        {/* Main Content: Clinical Note Text */}
        <div className="flex-1 overflow-y-auto h-full p-4 bg-gray-50 border rounded-xl shadow">
          <h2 className="text-lg font-semibold">Transcriptions</h2>
          <p className="text-sm text-muted-foreground mb-4">
            {selectedDate ? `Date: ${selectedDate}` : "No date selected"}
          </p>

          <div className="prose prose-sm max-w-none text-[#2c2c2c]">
            {selectedFact?.transcript?.map((recordInfo, i) => (
              <div key={i} className="mb-4 space-y-1">
                {Object.keys(recordInfo).map((key) => {
                  const value = recordInfo[key as keyof TranscriptEntry];
                  return (
                    <div key={key} className="flex">
                      <strong className="capitalize mr-2">{key}:</strong>
                      <span className="whitespace-pre-wrap">{value}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
};

export default TranscriptionTab;
