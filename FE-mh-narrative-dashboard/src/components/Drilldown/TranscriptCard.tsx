import {useEffect, useRef, useState} from "react";
import { MessageSquare} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type {InsightExpandViewItem} from "@/types/props";
import type {Encounter} from "@/types/dataTypes";
import DataSourceIcon from "../DatasourceIcon";

interface clinicalTranscriptsFactsProps {
    clinicalTranscriptsFacts: InsightExpandViewItem[];
    sessionInfo: Encounter[];
}

const TranscriptCard = ({clinicalTranscriptsFacts, sessionInfo} : clinicalTranscriptsFactsProps) => {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedFactKey, setSelectedFactKey] = useState<string | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (clinicalTranscriptsFacts.length > 0) {
            setSelectedFactKey(clinicalTranscriptsFacts[0].key);
        } else {
            setSelectedFactKey(null);
        }
    }, [clinicalTranscriptsFacts]);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const highlightEl = container.querySelector(".highlight-target") as HTMLElement;
        if (highlightEl) {
            container.scrollTo({
                top: highlightEl.offsetTop - container.offsetTop,
                behavior: "smooth",
            });
        }
    }, [selectedDate, selectedFactKey]);

    // Find selected fact based on selectedFactKey
    const selectedFact = clinicalTranscriptsFacts.find(fact => fact.key === selectedFactKey);
    const dates = sessionInfo?.map(item => item.encounter_date);
    const selectedFactSpec = selectedFact?.highlightSpec;
    const highlightDates = new Set(
        (Array.isArray(selectedFact?.highlightSpec) ? selectedFact?.highlightSpec : [])
            .map(spec => spec?.date)
    );

    useEffect(() => {
        if (dates && dates.length > 0 && !selectedDate) {
            setSelectedDate(dates[dates.length - 1]);
        }
    }, [dates, selectedDate]);

    const specTexts = (Array.isArray(selectedFactSpec) ? selectedFactSpec : [])
        .filter((s) => s?.date === selectedDate)
        .map((s) => s?.text?.split(":")[1]?.trim() ?? "");

    function highlightMatches(text: string, highlights: string[]): string {
        if (!text || !highlights?.length) return text;

        let result = text;

        highlights.forEach((highlight) => {
            if (!highlight) return;
            // Escape special regex chars
            const escaped = highlight.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
            const regex = new RegExp(`(${escaped})`, "gi");
            result = result.replace(regex, '<mark style="background-color: rgba(0, 188, 125, 0.15);">$1</mark>');
        });

        return result;
    }

    return (
      <Card className="bg-white border-[#eaeaea]">
        <CardContent className="px-6">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4 font-medium">
            {/* <MessageSquare className="w-4 h-4 text-[#9FB40F]" />
                    <span className="text-[#9FB40F] font-medium">Transcript</span> */}
            <DataSourceIcon iconType="session transcript" showType />
          </div>

          {/* Date buttons on top */}
          <div className="flex gap-4 mb-6 overflow-x-auto no-scrollbar">
            {dates?.map((date) => {
              const isSelected = selectedDate === date;
              const isHighlighted = highlightDates.has(date);

              const baseClasses =
                "whitespace-nowrap px-4 py-2 text-sm border-[#d9d9d9]";
              const highlightBg = "bg-emerald-500/40";
              const selectedBorder = "border-2 border-[#1e1e1e]";

              return (
                <Button
                  key={date}
                  variant="outline"
                  onClick={() => setSelectedDate(date)}
                  className={`${baseClasses} ${
                    isHighlighted ? highlightBg : "bg-white"
                  } ${isSelected ? selectedBorder : ""}`}
                >
                  {/* {formatDate(date)} */}
                  {date}
                </Button>
              );
            })}
          </div>

          <div className="flex gap-8">
            {/* Left vertical buttons (summary sentences for selected date) */}
            {/* <div className="flex-shrink-0 space-y-4 w-[30%]">
              {clinicalTranscriptsFacts.map((fact) => (
                <Button
                  key={fact.key}
                  disabled={!highlightDates.has(selectedDate ?? "")}
                  variant="outline"
                  onClick={() => setSelectedFactKey(fact.key)}
                  className={`w-full justify-start h-auto text-left whitespace-normal text-sm border-[#d9d9d9] ${
                    selectedFactKey === fact.key ? "bg-[#f7f5f5]" : "bg-white"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-gray-600 rounded-full mt-2 flex-shrink-0" />
                    <span>{fact.summarySentence}</span>
                  </div>
                </Button>
              ))}
            </div> */}

            {/* Right side: selected fact details */}
            <div
              ref={scrollContainerRef}
              className="space-y-6 text-sm text-[#2c2c2c] overflow-y-auto"
              style={{
                flex: 1,
                maxHeight: "300px" /* match container height */,
                paddingRight: "1rem",
              }}
            >
              {sessionInfo
                ?.filter((dp) => dp.encounter_date === selectedDate)
                .map((dp, index) => (
                  <div key={index} className="space-y-1">
                    <div className="prose prose-sm max-w-none text-[#2c2c2c]">
                      {dp?.transcript?.map((recordInfo, i) => (
                        <div key={i} className="mb-4 space-y-2">
                          {Object.keys(recordInfo).map((key) => {
                            const value = recordInfo[key];
                            const highlightedValue = highlightMatches(
                              value,
                              specTexts
                            );

                            return (
                              <div key={key}>
                                <strong className="block capitalize">
                                  {key}:
                                </strong>
                                <p
                                  className={`whitespace-pre-wrap ${
                                    specTexts.some((text) =>
                                      value.includes(text)
                                    )
                                      ? "highlight-target"
                                      : ""
                                  }`}
                                  dangerouslySetInnerHTML={{
                                    __html: highlightedValue,
                                  }}
                                />
                              </div>
                            );
                          })}
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
