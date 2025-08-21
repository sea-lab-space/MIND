import InsightCardComponent from "@/components/DataInsights/InsightCardComponent";
import { useState, useRef, useEffect } from "react";
import SectionTitle from "../components/section";
import DrilldownPanel from "../components/Drilldown/DrilldownPanel";
import OverviewComponent from "@/components/Overview/OverviewComponent";
import PatientCommunicationComponent from "@/components/PatientCommunication/PatientCommunicationComponent";
import PatientMessageDialog from "@/components/PatientCommunication/PatientMessageDialog";
import { useWindowSize } from "usehooks-ts";
import { Button } from "@/components/ui";
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
import { type SuggestedActivity } from "@/types/dataTypes";
import OverviewSummary from "@/components/BaseLine/OverciewSummary";
import VerticalTimeline from "@/components/Timeline/TimelineVis";
import * as d3 from "d3";

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
  >([]);

  const [selectedActivities, setSelectedActivities] = useState<
    SuggestedActivity[]
  >([]);

  const [isDrillDown, setIsDrillDown] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    overview: false,
    insights: false,
    lastSession: false,
    communication: false,
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
  const [globalExpand, setGlobalExpand] = useState(false);
  const [expandTimelineSections, setExpandTimelineSections] = useState({
    overview: false,
    lastSession: true,
    insights: false,
    communication: false,
  });
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  //to support cards be used by the timeline

  const allData = [
    ...insightCardData, ...last_encounter
  ]

  const toggleSection = (
    section: "overview" | "insights" | "communication"
  ) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleTimelineSection = (
      section: "overview" | "insights" | "lastSession" | "communication"
  ) => {
    setExpandTimelineSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
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
    setExpandedSections({
      overview: false,
      insights: false,
      communication: false,
    });
    setExpandTimelineSections({
      overview: false,
      lastSession: true,
      insights: false,
      communication: false,
    });
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
    communication: null,
  });


  const lastTimelineSectionRef = useRef<string | null>(null);

  const toggleTimelineSectionSingle = (sectionToToggle: keyof typeof expandTimelineSections) => {
    setExpandTimelineSections((prev) => {
      const newState: Record<string, boolean> = {};
      Object.keys(prev).forEach((key) => {
        newState[key] = key === sectionToToggle ? true : false;
      });
      return newState;
    });
  };


// In MINDTab component, replace the handleTimelineStateChange function with this:

  const handleTimelineStateChange = (selectedValue: string | null) => {
    if (!selectedValue) return;

    const sectionMap: Record<string, keyof typeof expandTimelineSections> = {
      "insights": "insights",
      "2021-05-09": "lastSession", // Date maps to lastSession
      "2021-06-07": "communication" // Date maps to communication (today)
    };

    const targetSection = sectionMap[selectedValue];
    if (!targetSection) return;

    // Expand only the selected section
    setExpandTimelineSections(prev => ({
      overview: false,
      lastSession: targetSection === "lastSession",
      insights: targetSection === "insights",
      communication: targetSection === "communication"
    }));

    // Scroll to section
    sectionRefs.current[targetSection]?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };


  return (
    <>
      {/* <div className="flex flex-col h-full"> */}
      <div className="flex gap-4 h-full py-2 px-4">
        {/* Left column: scrollable independently */}
        {overviewCardData && !isDrillDown && (
          <div
            className="flex flex-col w-[220px] shrink-0 sticky top-0 z-10 gap-2"
            ref={(el) => {
              sectionRefs.current.overview = el;
            }}
          >
            <OverviewSummary overviewCardData={overviewCardData} />
            <h3 className="text-base font-semibold">Navigation</h3>
            <VerticalTimeline
              ref={timelineRef}
              dates={[
                { date: "2021-05-09", label: "Last session" },
                { date: "2021-06-07", label: "Today" },
              ]}
              onStateChange={handleTimelineStateChange}
            />
          </div>
        )}
        <div
          className={`flex flex-grow py-0 px-4 gap-4 overflow-y-auto ${
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
                  isExpanded={expandedSections.overview}
                  onClick={() => toggleSection("overview")}
                >
                  <OverviewComponent
                    overviewData={overviewCardData}
                    isExpanded={expandedSections.overview}
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
                    isExpanded={expandedSections.lastSession || globalExpand}
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
                                  isExpanded={expandedSections.insights || globalExpand}
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

                {/*<SectionTitle*/}
                {/*  title="Last Session"*/}
                {/*  // subtitle="test"*/}
                {/*  isExpanded={expandedSections.insights || globalExpand}*/}
                {/*  // TODO*/}
                {/*  onClick={() => {}}*/}
                {/*>*/}
                {/*  <div*/}
                {/*      className={`grid gap-4 ${*/}
                {/*          isDrillDown ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2"*/}
                {/*      }`}*/}
                {/*  >*/}

                {/*  /!* Left Column *!/*/}
                {/*    <div className="flex flex-col gap-4">*/}
                {/*      {last_encounter.map((card, index) => (*/}
                {/*        <div*/}
                {/*          key={card.key}*/}
                {/*          ref={(el) => {*/}
                {/*            cardRefs.current[index * 2] = el;*/}
                {/*          }}*/}
                {/*          className="w-full"*/}
                {/*        >*/}
                {/*          <InsightCardComponent*/}
                {/*            key={card.key}*/}
                {/*            insightCardData={card}*/}
                {/*            isExpanded={false*/}
                {/*              // globalExpand || expandedCards.has(card.key)*/}
                {/*            }*/}
                {/*            onToggle={handleToggleCard}*/}
                {/*            isDrillDown={isDrillDown}*/}
                {/*            title={card.summaryTitle}*/}
                {/*            sources={card.sources}*/}
                {/*            isInsightHeaderSelected={selectedInsightHeader.includes(*/}
                {/*              card.key*/}
                {/*            )}*/}
                {/*            isInsightCardSelected={*/}
                {/*              selectedInsightCard === card.key*/}
                {/*            }*/}
                {/*            handleCardSelect={() =>*/}
                {/*              handleCardSelection(card.key, index * 2)*/}
                {/*            }*/}
                {/*            handleCardHeaderClick={() =>*/}
                {/*              handleInsightCardHeaderSelect(card.key)*/}
                {/*            }*/}
                {/*          />*/}
                {/*        </div>*/}
                {/*      ))}*/}
                {/*    </div>*/}
                {/*  </div>*/}
                {/*</SectionTitle>*/}
              </div>
              {/* Data-driven Insights bg-green-200/50 */}
              <div
                className="rounded mb-2 mt-2 relative z-10"
                ref={(el) => {
                  sectionRefs.current.insights = el;
                }}
              >

                <SectionTitle
                    title="Patient Data Outlook"
                    subtitle="(2021-05-09 to 2021-06-07)"
                    isExpanded={expandedSections.insights || globalExpand}
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
                                    isExpanded={globalExpand || expandedCards.has(card.key)}
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

                {/*    /!* Right column *!/*/}
                {/*    <div className="flex flex-col gap-4">*/}
                {/*      {filteredInsightCards.map(*/}
                {/*          (card, index) =>*/}
                {/*              index % 2 === 1 && ( // Odd index → right*/}
                {/*                  <div*/}
                {/*                      key={card.key}*/}
                {/*                      ref={(el) => {*/}
                {/*                        cardRefs.current[index] = el;*/}
                {/*                      }}*/}
                {/*                      className="w-full"*/}
                {/*                  >*/}
                {/*                    <InsightCardComponent*/}
                {/*                        key={card.key}*/}
                {/*                        insightCardData={card}*/}
                {/*                        isExpanded={globalExpand || expandedCards.has(card.key)}*/}
                {/*                        onToggle={handleToggleCard}*/}
                {/*                        isDrillDown={isDrillDown}*/}
                {/*                        title={card.summaryTitle}*/}
                {/*                        sources={card.sources}*/}
                {/*                        isInsightHeaderSelected={selectedInsightHeader.includes(card.key)}*/}
                {/*                        isInsightCardSelected={selectedInsightCard === card.key}*/}
                {/*                        handleCardSelect={() =>*/}
                {/*                            handleCardSelection(card.key, index)*/}
                {/*                        }*/}
                {/*                        handleCardHeaderClick={() =>*/}
                {/*                            handleInsightCardHeaderSelect(card.key)*/}
                {/*                        }*/}
                {/*                    />*/}
                {/*                  </div>*/}
                {/*              )*/}
                {/*      )}*/}
                {/*    </div>*/}
                {/*  </div>*/}
                {/*</SectionTitle>*/}

              </div>

              {/* Patient Communication bg-yellow-200/50  */}
              <div
                className="rounded relative z-10"
                ref={(el) => {
                  sectionRefs.current.communication = el;
                }}
              >
                <SectionTitle
                  title="Discussion points today"
                  subtitle="(2021-06-07)"
                  // subtitle="test"
                  isExpanded={expandedSections.communication}
                  onClick={() => toggleTimelineSection("communication")}
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
                    expandTimelineSections.communication &&
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
      {/*<div className="flex flex-col bg-gray-50">*/}
      {/*</div>*/}
    </>
  );
};

export default MINDTab;
