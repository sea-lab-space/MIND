import InsightCardComponent from "@/components/DataInsights/InsightCardComponent";
import { useState, useRef, useEffect } from "react";
import Header from "../components/header";
import SectionTitle from "../components/section";
import DrilldownPanel from "../components/Drilldown/DrilldownPanel";
import OverviewComponent from "@/components/Overview/OverviewComponent";
import PatientCommunicationComponent from "@/components/PatientCommunication/PatientCommunicationComponent";
import PatientMessageDialog from "@/components/PatientCommunication/PatientMessageDialog";
import { useWindowSize } from "usehooks-ts";
import { Button } from "@/components/ui";
import { Pencil } from "lucide-react";
import {FilterSelector} from "@/components/FilterSelector";
import { nameList, retrospectHorizon} from "@/data/data";
import { InsightType, type InsightCardData } from "@/types/props";
import {
   getVisualizerDataForPerson,
} from "@/utils/dataConversion";
import { getUserFromHashUrl } from "@/utils/helper";


export default function HomePage() {
  const [selectedInsightHeader, setSelectedInsightHeader] = useState<string[]>([]);
  const [selectedInsightCard, setSelectedInsightCard] = useState<string | null>(null);
  const [selectedInsightTypes, setSelectedInsightTypes] = useState<InsightType[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>("Gabriella Lin");
  const [isDrillDown, setIsDrillDown] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    overview: false,
    insights: false,
    communication: false,
  });

  const userName = getUserFromHashUrl()

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { overviewCardData, insightCardData, session_subjective_info, suggested_activity_data } = getVisualizerDataForPerson(selectedPatient);

  const toggleSection = (section: "overview" | "insights" | "communication") => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  useEffect(() => {
    setExpandedSections({
      overview: false,
      insights: false,
      communication: false,
    })
    setSelectedInsightCard(null);
    setIsDrillDown(false);
    setSelectedInsightHeader([]);
  }, [selectedPatient]);

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { width: windowWidth } = useWindowSize();
  const rightPanelWidth = isDrillDown ? Math.max((windowWidth * 2) / 3, 800) : 0;

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
        cardEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  insightCardData.filter(card => {
    const matchedTypes = card.insightType.filter(type =>
    {
      selectedInsightTypes.includes(type.type)
    }
    );
    if (matchedTypes.length > 0) {
      return true;
    }
    return false;
  });

  const filteredInsightCards =
      selectedInsightTypes.length === 0
          ? insightCardData
          : insightCardData.filter(card =>
              Array.isArray(card.insightType) &&
              card.insightType.some(insight =>
                  selectedInsightTypes.includes(insight.type)
              )
          );

  const leftColumnCards = filteredInsightCards.filter((_, i) => i % 2 === 0);
  const rightColumnCards = filteredInsightCards.filter((_, i) => i % 2 !== 0);


  const selectedInsightCardTitles = insightCardData
      .filter((card) => selectedInsightHeader.includes(card.key))
      .map((card) => card.summaryTitle);

  return (
    <>
      <div className="flex flex-col h-screen bg-gray-50">
        <div className="sticky top-0 z-50 bg-gray-50 shadow-md">
          <Header
            patientNames={nameList}
            userName={userName}
            retrospectHorizon={retrospectHorizon}
            selectedPatient={selectedPatient}
            setSelectedPatient={setSelectedPatient}
            isHomePage={true}
          />
        </div>
        <FilterSelector
            selectedPatient={selectedPatient}
          selected={selectedInsightTypes}
          onToggle={(type) => {
            setSelectedInsightTypes((prev) =>
              prev.includes(type)
                ? prev.filter((t) => t !== type)
                : [...prev, type]
            );
          }}
        />

        <div
          className={`flex flex-grow py-2 px-4 gap-4 overflow-y-auto ${
            !isDrillDown ? "flex-col w-full mx-auto" : ""
          }`}
        >
          <div
            className={`flex flex-col ${
              isDrillDown ? "w-1/3 overflow-y-auto" : "w-full mx-auto"
            }`}
          >
            <div className="relative">
              <div className="absolute left-8.5 top-4 bottom-0 w-0.5 bg-[#d9d9d9] z-0" />
              {/* ChartReview bg-red-200/50 */}
              <div className="rounded p-4 relative z-10">
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

              {/* Data-driven Insights bg-green-200/50 */}
              <div className="rounded p-4 mb-2 relative z-10">
                <SectionTitle
                  title="Data-driven Insights"
                  // subtitle="test"
                  isExpanded={expandedSections.insights}
                  onClick={() => toggleSection("insights")}
                >
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
                            cardRefs.current[index * 2] = el
                          }}
                          className="w-full"
                        >
                          <InsightCardComponent
                            insightCardData={card}
                            isDrillDown={isDrillDown}
                            title={card.summaryTitle}
                            sources={card.sources}
                            isExpanded={expandedSections.insights}
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
                            cardRefs.current[index * 2 + 1] = el
                          }}
                          className="w-full"
                        >
                          <InsightCardComponent
                              isDrillDown={isDrillDown}
                              insightCardData={card}
                            title={card.summaryTitle}
                            sources={card.sources}
                            isExpanded={expandedSections.insights}
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
              <div className="rounded p-4 relative z-10">
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
                      <Pencil className="w-4 h-4 mr-2" /> Draft Patient Message
                    </Button>
                  }
                  shouldExpand={false}
                >
                  <PatientCommunicationComponent
                    isDrillDown={isDrillDown}
                    selectedInsightCardTitles={selectedInsightCardTitles}
                    suggested_activity_data={suggested_activity_data}
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
                  insightData={insightCardData.find((data) => data.key === selectedInsightCard) || {} as InsightCardData}
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
      />
    </>
  );
}
