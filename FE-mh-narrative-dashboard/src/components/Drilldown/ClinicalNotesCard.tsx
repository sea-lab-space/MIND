import {useEffect, useRef, useState} from "react";
import {StickyNote} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import type {InsightExpandViewItem} from "@/types/props";
import type {Encounter} from "@/types/dataTypes";
import DataSourceIcon from "../DatasourceIcon";


interface clinicalNotesFactsProps {
    clinicalNotesFacts: InsightExpandViewItem[];
    sessionInfo: Encounter[]
}

const ClinicalNotesCard = ({ clinicalNotesFacts, sessionInfo }: clinicalNotesFactsProps) => {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedFactKey, setSelectedFactKey] = useState<string | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        if (clinicalNotesFacts.length > 0) {
            setSelectedFactKey(clinicalNotesFacts[0].key);
        } else {
            setSelectedFactKey(null);
        }
    }, [clinicalNotesFacts]);

    // Find selected fact based on selectedFactKey
    const selectedFact = clinicalNotesFacts.find(fact => fact.key === selectedFactKey);
    const selectedFactSpec = selectedFact?.highlightSpec;
    const dates = sessionInfo?.map(item => item.encounter_date);
    const highlightDates = new Set(
        (Array.isArray(selectedFact?.highlightSpec) ? selectedFact?.highlightSpec : [])
            .map(spec => spec?.date)
    );

    useEffect(() => {
        if (dates && dates.length > 0 && !selectedDate) {
            setSelectedDate(dates[dates.length - 1]);
        }
    }, [dates, selectedDate]);

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

    function highlightTextInRecord(record: string, highlights: string[]): string {
        let highlighted = record;
        highlights.forEach((text) => {
            if (text && highlighted.includes(text)) {
                const escapedText = text.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'); // Escape regex
                const regex = new RegExp(escapedText, "g");
                highlighted = highlighted.replace(
                  regex,
                  `<mark style="background-color: rgba(240, 177, 0, 0.25);">${text}</mark>`
                );
            }
        });
        return highlighted;
    }

    return (
      <Card className="bg-white border-[#eaeaea]">
        <CardContent className="px-6">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4 font-medium">
            {/* <StickyNote className="w-4 h-4 text-[#ffc100]" />
                    <span className="text-[#ffc100] font-medium">Clinical Notes</span> */}
            <DataSourceIcon iconType="clinical note" showType />
          </div>

          {/* Date buttons on top */}
          <div className="flex gap-4 mb-6 overflow-x-auto no-scrollbar">
            {dates?.map((date) => {
              const isSelected = selectedDate === date;
              const isHighlighted = highlightDates.has(date);

              const baseClasses =
                "whitespace-nowrap px-4 py-2 text-sm border-[#d9d9d9]";
              const highlightBg = "bg-[#FFC100]/40";
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
            <div className="flex-shrink-0 space-y-4 w-80">
              {clinicalNotesFacts.map((fact) => (
                <Button
                  key={fact.key}
                  disabled={!highlightDates.has(selectedDate ?? "")}
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
              ref={scrollContainerRef}
              className="space-y-6 text-sm text-[#2c2c2c] overflow-y-auto"
              style={{ flex: 1, maxHeight: "500px", paddingRight: "1rem" }}
            >
              {sessionInfo
                ?.filter((dp) => dp.encounter_date === selectedDate)
                .map((dp, index) => (
                  <div key={index} className="space-y-1">
                    <div className="prose prose-sm max-w-none text-[#2c2c2c]">
                      <ReactMarkdown
                        rehypePlugins={[rehypeRaw]}
                        components={{
                          mark: ({ node, ...props }) => (
                            <mark
                              className="highlight-target"
                              style={{
                                backgroundColor: "#FFC100",
                                padding: "0.1rem 0.25rem",
                                borderRadius: "0.25rem",
                              }}
                              {...props}
                            />
                          ),
                        }}
                      >
                        {highlightTextInRecord(
                          dp.clinical_note || "",
                          (Array.isArray(selectedFactSpec)
                            ? selectedFactSpec
                            : []
                          )
                            .filter((s) => s.date === dp.encounter_date)
                            .map((s) => s.text)
                        )}
                      </ReactMarkdown>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
};

export default ClinicalNotesCard;
