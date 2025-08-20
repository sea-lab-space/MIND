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
  type InsightExpandViewItem,
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
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  //to support cards be used by the timeline
  console.log(groupInsights(insightCardData), "printing cards");

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

  const midpoint = Math.ceil(filteredInsightCards.length / 2);

  const leftColumnCards = filteredInsightCards.slice(0, midpoint); // first half
  const rightColumnCards = filteredInsightCards.slice(midpoint); // second half
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
    insights: null,
    communication: null,
  });

  const [section, setSection] = useState<string>("overview");

  const handleTimelineStateChange = (state: [Date, Date] | null) => {
    if (!state) return;

    const [startDate, endDate] = state;
    const parseDate = d3.timeParse("%Y-%m-%d");

    const targetStart = parseDate("2021-05-09");
    const targetEnd = parseDate("2021-06-07");

    if (targetStart && targetEnd) {
      if (
        startDate.getTime() === targetStart.getTime() &&
        endDate.getTime() === targetEnd.getTime()
      ) {
        setSection("insights");

        const target = sectionRefs.current.insights;
        target?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
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
                // { date: "2021-03-28", label: "First session" },
                // { date: "2021-04-11", label: "Second session" },
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
                  title="Overview"
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
                  title="Last Session"
                  // subtitle="test"
                  isExpanded={expandedSections.insights || globalExpand}
                  // TODO
                  onClick={() => {}}
                >
                  <div
                    className={`${
                      isDrillDown
                        ? "flex flex-col gap-4"
                        : "grid grid-cols-1 sm:grid-cols-2 gap-4"
                    }`}
                  >
                    {/* Left Column */}
                    <div className="flex flex-col gap-4">
                      {last_encounter.map((card, index) => (
                        <div
                          key={card.key}
                          ref={(el) => {
                            cardRefs.current[index * 2] = el;
                          }}
                          className="w-full"
                        >
                          <InsightCardComponent
                            key={card.key}
                            insightCardData={card}
                            isExpanded={false
                              // globalExpand || expandedCards.has(card.key)
                            }
                            onToggle={handleToggleCard}
                            isDrillDown={isDrillDown}
                            title={card.summaryTitle}
                            sources={card.sources}
                            isInsightHeaderSelected={selectedInsightHeader.includes(
                              card.key
                            )}
                            isInsightCardSelected={
                              selectedInsightCard === card.key
                            }
                            handleCardSelect={() =>
                              handleCardSelection(card.key, index * 2)
                            }
                            handleCardHeaderClick={() =>
                              handleInsightCardHeaderSelect(card.key)
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
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
                  title="Clinical Insights"
                  // subtitle="test"
                  isExpanded={expandedSections.insights || globalExpand}
                  onClick={() => {
                    setGlobalExpand((prev) => !prev);
                    if (!globalExpand) {
                      setExpandedCards(new Set()); // Clear overrides when expanding all
                    }
                  }}
                >
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
                    className={`${
                      isDrillDown
                        ? "flex flex-col gap-4"
                        : "grid grid-cols-1 sm:grid-cols-2 gap-4"
                    }`}
                  >
                    {/* Left column */}
                    <div className="flex flex-col gap-4">
                      {leftColumnCards.map((card, index) => (
                        <div
                          key={card.key}
                          ref={(el) => {
                            cardRefs.current[index * 2] = el;
                          }}
                          className="w-full"
                        >
                          <InsightCardComponent
                            key={card.key}
                            insightCardData={card}
                            isExpanded={
                              globalExpand || expandedCards.has(card.key)
                            }
                            onToggle={handleToggleCard}
                            isDrillDown={isDrillDown}
                            title={card.summaryTitle}
                            sources={card.sources}
                            isInsightHeaderSelected={selectedInsightHeader.includes(
                              card.key
                            )}
                            isInsightCardSelected={
                              selectedInsightCard === card.key
                            }
                            handleCardSelect={() =>
                              handleCardSelection(card.key, index * 2)
                            }
                            handleCardHeaderClick={() =>
                              handleInsightCardHeaderSelect(card.key)
                            }
                          />
                        </div>
                      ))}
                    </div>

                    {/* Right column */}
                    <div className="flex flex-col gap-4">
                      {rightColumnCards.map((card, index) => (
                        <div
                          key={card.key}
                          ref={(el) => {
                            cardRefs.current[index * 2 + 1] = el;
                          }}
                          className="w-full"
                        >
                          <InsightCardComponent
                            key={card.key}
                            insightCardData={card}
                            isExpanded={
                              globalExpand || expandedCards.has(card.key)
                            }
                            onToggle={handleToggleCard}
                            isDrillDown={isDrillDown}
                            title={card.summaryTitle}
                            sources={card.sources}
                            isInsightHeaderSelected={selectedInsightHeader.includes(
                              card.key
                            )}
                            isInsightCardSelected={
                              selectedInsightCard === card.key
                            }
                            handleCardSelect={() =>
                              handleCardSelection(card.key, index * 2 + 1)
                            }
                            handleCardHeaderClick={() =>
                              handleInsightCardHeaderSelect(card.key)
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </SectionTitle>
              </div>

              {/* Patient Communication bg-yellow-200/50  */}
              <div
                className="rounded relative z-10"
                ref={(el) => {
                  sectionRefs.current.communication = el;
                }}
              >
                <SectionTitle
                  title="Patient Communication"
                  // subtitle="test"
                  isExpanded={expandedSections.communication}
                  onClick={() => toggleSection("communication")}
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
                  <PatientCommunicationComponent
                    isDrillDown={isDrillDown}
                    selectedInsightCardTitles={selectedInsightCardTitles}
                    suggested_activity_data={suggested_activity_data}
                    updateActivities={setSelectedActivities}
                  />
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
