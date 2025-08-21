import InsightCardComponent from "@/components/DataInsights/InsightCardComponent";
import { useState, useRef, useEffect } from "react";
import SectionTitle from "../components/section";
import DrilldownPanel from "../components/Drilldown/DrilldownPanel";
import OverviewComponent from "@/components/Overview/OverviewComponent";
import PatientCommunicationComponent from "@/components/PatientCommunication/PatientCommunicationComponent";
import { useWindowSize } from "usehooks-ts";
import { Pencil } from "lucide-react";
import { FilterSelector } from "@/components/FilterSelector";
import {
  InsightType,
  type InsightCardData,
  type InsightExpandViewItem, dateSectionMap,
} from "@/types/props";
import { getVisualizerDataForPerson } from "@/utils/dataConversion";
import {
  flattenAllExpandViews,
  groupInsights,
  groupInsightsBySource,
} from "@/utils/helper";
import { Button } from "@/components/ui";

import { type SuggestedActivity } from "@/types/dataTypes";
import OverviewSummary from "@/components/BaseLine/OverciewSummary";
import * as React from 'react';
import PatientMessageDialog from "@/components/PatientCommunication/PatientMessageDialog";
import TimeLineGraph from "@/components/Timeline/TimeLine";



interface MINDTabProps {
  selectedPatient: string;
  clinicianName: string;
}

const MINDTab: React.FC<MINDTabProps> = ({
  selectedPatient,
  clinicianName,
}) => {
  const [selectedInsightHeader, setSelectedInsightHeader] = useState<string[]>(
    []
  );
  const [selectedInsightCard, setSelectedInsightCard] = useState<string | null>(
    null
  );
  const [selectedInsightTypes, setSelectedInsightTypes] = useState<
    InsightType[]
  >(['psychological']);

  const [selectedActivities, setSelectedActivities] = useState<
    SuggestedActivity[]
  >([]);

  const [isDrillDown, setIsDrillDown] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    insights: false,
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const {
    overviewCardData,
    insightCardData,
    session_subjective_info,
    suggested_activity_data,
    survey_data,
    last_encounter
  } = getVisualizerDataForPerson(selectedPatient);
  const [expandTimelineSections, setExpandTimelineSections] = useState({
    medicalHistory: false,
    lastSession: true,
    insights: false,
    recapToday: false,
  });
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [selectedTimeline, setSelectedTimeline] = useState<string | null>(null);

  //to support cards be used by the timeline

  const allData = [
    ...insightCardData, ...last_encounter
  ]

  const toggleTimelineSection = (
      section: "medicalHistory" | "insights" | "lastSession" | "recapToday"
  ) => {
    setExpandTimelineSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
    if(section !==  "medicalHistory" &&  !expandTimelineSections[section]){
      setSelectedTimeline(section);
    }
  };

  const handleTimelineSelect = (key: string) => {
    setSelectedTimeline(key);
    selectTimelineSection(key);
  };

  const selectTimelineSection = (
      section: "medicalHistory" | "insights" | "lastSession" | "recapToday"
  ) => {
    setExpandTimelineSections({
      medicalHistory: false,
      insights: false,
      lastSession: false,
      recapToday: false,
      [section]: true, // only this section is true
    });
  };

  const handleToggleCard = (cardKey: string, expand: boolean) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (expand) {
        next.add(cardKey);
      } else {
        next.delete(cardKey);
      }
      return next;
    });
  };

  useEffect(() => {
    setExpandTimelineSections({
      overview: false,
      lastSession: true,
      insights: false,
      recapToday: false,
    });
    handleTimelineSelect('lastSession')
    setSelectedInsightCard(null);
    setIsDrillDown(false);
    setSelectedInsightHeader([]);
  }, [selectedPatient]);

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { width: windowWidth } = useWindowSize();
  const rightPanelWidth = isDrillDown
    ? Math.max((windowWidth * 2) / 3, 800)
    : 0;

  const handleInsightCardHeaderSelect = (key: string) => {
    setSelectedInsightHeader((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleCardSelection = (key: string, index: number) => {
    setSelectedInsightCard(key);
    setIsDrillDown(true);
    setTimeout(() => {
      const cardEl = cardRefs.current[index];
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  const filteredInsightCards =
    selectedInsightTypes.length === 0
      ? insightCardData
      : insightCardData.filter(
          (card) =>
            Array.isArray(card.insightType) &&
            card.insightType.some((insight) =>
              selectedInsightTypes.includes(insight.type)
            )
        );

  const allExpandViews = flattenAllExpandViews(insightCardData);

  const {
    passiveSensingFacts = [],
  }: { passiveSensingFacts?: InsightExpandViewItem[] } =
    groupInsightsBySource(allExpandViews);
  const selectedInsightCardTitles = insightCardData
    .filter((card) => selectedInsightHeader.includes(card.key))
    .map((card) => card.summaryTitle);

  const timelineRef = useRef(null);

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({
    overview: null,
    lastSession: null,
    insights: null,
    recapToday: null,
  });


  return (
    <>
      {/* <div className="flex flex-col h-full"> */}
      <div className="flex gap-4 h-full py-2 px-4">
        {/* Left column: scrollable independently */}
        {overviewCardData && !isDrillDown && (
            <div
                className="flex flex-col w-[220px] shrink-0 sticky top-0 z-10 gap-2 max-h-screen overflow-y-auto"
                ref={(el) => {
                  sectionRefs.current.overview = el;
                }}
            >
              <OverviewSummary overviewCardData={overviewCardData} />
              <h3 className="text-base font-semibold">Navigation</h3>

              {/* Timeline graph section */}
                <div className="max-w-[400px]">
                 <TimeLineGraph  selectedTimeline={selectedTimeline}
                                 handleTimelineSelect={handleTimelineSelect}
                  />
              </div>
            </div>
        )}


        <div
          className={`flex flex-grow py-0 px-2 gap-4 overflow-y-auto ${
            !isDrillDown ? "flex-col w-full mx-auto" : ""
          }`}
        >
          <div
            className={`flex flex-col ${
              isDrillDown ? "w-1/3 overflow-y-auto" : "w-full mx-auto"
            }`}
          >
            <div className="relative">
              <div className="absolute left-4.5 top-4 bottom-0 w-0.5 bg-[#d9d9d9] z-0" />
              {/* ChartReview bg-red-200/50 */}
              <div className="rounded relative z-10">
                <SectionTitle
                  title="Medical history"
                  // subtitle="test"
                  isExpanded={expandTimelineSections.medicalHistory}
                  onClick={() => toggleTimelineSection("medicalHistory")}
                >
                  <OverviewComponent
                    overviewData={overviewCardData}
                    isExpanded={expandTimelineSections.medicalHistory}
                    isDrillDown={isDrillDown}
                  />
                </SectionTitle>
              </div>

              <div
                className="rounded mb-2 mt-2 relative z-10"
                // ref={(el) => {
                //   sectionRefs.current.insights = el;
                // }}
              >
                <SectionTitle
                    title="Session Recap"
                    subtitle="(2021-05-09)"
                    isExpanded={expandTimelineSections.lastSession}
                    onClick={() =>
                        toggleTimelineSection("lastSession")
                    }
                >
                  {
                    expandTimelineSections.lastSession &&
                      <div
                          className={`grid gap-4 ${
                              isDrillDown ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
                          }`}
                      >
                        {last_encounter.map((card, index) => (
                            <div
                                key={card.key}
                                ref={(el) => {
                                  cardRefs.current[index] = el;
                                }}
                                className="w-full"
                            >
                              <InsightCardComponent
                                  key={card.key}
                                  insightCardData={card}
                                  isExpanded={expandedSections.insights}
                                  onToggle={handleToggleCard}
                                  isDrillDown={isDrillDown}
                                  title={card.summaryTitle}
                                  sources={card.sources}
                                  isInsightHeaderSelected={selectedInsightHeader.includes(card.key)}
                                  isInsightCardSelected={selectedInsightCard === card.key}
                                  handleCardSelect={() => handleCardSelection(card.key, index)}
                                  handleCardHeaderClick={() => handleInsightCardHeaderSelect(card.key)}
                              />
                            </div>
                        ))}
                      </div>
                  }
                </SectionTitle>

              </div>
              {/* Data-driven Insights bg-green-200/50 */}
              <div
                className="rounded mb-2 mt-2 relative z-10"
                ref={(el) => {
                  sectionRefs.current.insights = el;
                }}
              >

                <SectionTitle
                    title="Patient Data Insights"
                    subtitle="(2021-05-09 to 2021-06-07)"
                    isExpanded={expandTimelineSections.insights}
                    onClick={() =>
                        toggleTimelineSection("insights")
                    }
                >
                  {
                    expandTimelineSections?.insights &&
                      <>
                        {!isDrillDown && (
                            <FilterSelector
                                selectedPatient={selectedPatient}
                                selected={selectedInsightTypes}
                                onToggle={(type) => {
                                  setSelectedInsightTypes((prev) =>
                                      prev.includes(type) ? [] : [type]
                                  );
                                }}
                            />
                        )}

                        <div
                            className={`grid gap-4 ${
                                isDrillDown ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
                            }`}
                        >
                          {filteredInsightCards.map((card, index) => (
                              <div
                                  key={card.key}
                                  ref={(el) => {
                                    cardRefs.current[index] = el;
                                  }}
                                  className="w-full"
                              >
                                <InsightCardComponent
                                    key={card.key}
                                    insightCardData={card}
                                    isExpanded={expandedCards.has(card.key)}
                                    onToggle={handleToggleCard}
                                    isDrillDown={isDrillDown}
                                    title={card.summaryTitle}
                                    sources={card.sources}
                                    isInsightHeaderSelected={selectedInsightHeader.includes(card.key)}
                                    isInsightCardSelected={selectedInsightCard === card.key}
                                    handleCardSelect={() => handleCardSelection(card.key, index)}
                                    handleCardHeaderClick={() => handleInsightCardHeaderSelect(card.key)}
                                />
                              </div>
                          ))}
                        </div>
                      </>
                  }

                </SectionTitle>
              </div>

              {/* Patient Communication bg-yellow-200/50  */}
              <div
                className="rounded relative z-10"
                ref={(el) => {
                  sectionRefs.current.recapToday = el;
                }}
              >
                <SectionTitle
                  title="Discussion points today"
                  subtitle="(2021-06-07)"
                  // subtitle="test"
                  isExpanded={expandTimelineSections.recapToday}
                  onClick={() => toggleTimelineSection("recapToday")}
                  action={
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(true)}
                    >
                      <Pencil className="w-4 h-4 mr-1" />
                      Draft Patient Message
                    </Button>
                  }
                  shouldExpand={false}
                >
                  {
                    expandTimelineSections.recapToday &&
                      <PatientCommunicationComponent
                          isDrillDown={isDrillDown}
                          selectedInsightCardTitles={selectedInsightCardTitles}
                          suggested_activity_data={suggested_activity_data}
                          updateActivities={setSelectedActivities}
                      />
                  }
                </SectionTitle>
              </div>
            </div>
          </div>

          {/* Right drilldown panel */}
          {isDrillDown && (
            <div
              className="bg-gray-100 rounded overflow-y-auto overflow-x-hidden h-full"
              style={{ width: rightPanelWidth }}
            >
              <DrilldownPanel
                key={selectedInsightCard}
                insightData={
                  allData.find(
                    (data) => data.key === selectedInsightCard
                  ) || ({} as InsightCardData)
                }
                sessionInfo={session_subjective_info}
                onClose={() => {
                  setIsDrillDown(false);
                  setSelectedInsightCard(null);
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Dialog mounted outside main layout */}
      <PatientMessageDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedInsights={selectedInsightCardTitles}
        selectedActivities={selectedActivities}
        patientName={selectedPatient}
        clinicianName={clinicianName ?? "[Your care team]"}
      />
    </>
  );
};

export default MINDTab;
