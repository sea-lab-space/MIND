import InsightCardComponent from "@/components/DataInsights/InsightCardComponent";
import { useState, useRef } from "react";
import Header from "./components/header";
import SectionTitle from "./components/section";
import DrilldownPanel from "./components/DrilldownPanel";
import OverviewComponent from "@/components/Overview/OverviewComponent";
import PatientCommunicationComponent from "@/components/PatientCommunication/PatientCommunicationComponent";
import PatientMessageDialog from "@/components/PatientCommunication/PatientMessageDialog";
import { useWindowSize } from "usehooks-ts";
import { Button } from "@/components/ui";
import { Pencil } from "lucide-react";
import {FilterSelector} from "@/components/FilterSelector";
import {cardData, data, retrospectHorizon} from "@/data/data";

const nameList = [
  "John Doe", "Jane Smith", "Mike Johnson", "Sarah Wilson", "David Brown",
  "Lisa Davis", "Tom Miller", "Emma Garcia", "Alex Martinez", "Olivia Taylor",
];

const userName = "Ryan";


export default function App() {
  const [selectedInsightHeader, setSelectedInsightHeader] = useState<string[]>([]);
  const [selectedInsightCard, setSelectedInsightCard] = useState<number | null>(null);
  const [isDrillDown, setIsDrillDown] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    overview: false,
    insights: false,
    communication: false,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const insightCardData = data.insights;
  const patientCommunicationData = data.patientCommunication;

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { width: windowWidth } = useWindowSize();
  const rightPanelWidth = isDrillDown ? Math.max((windowWidth * 2) / 3, 800) : 0;

  const handleInsightCardHeaderSelect = (key: string) => {
    setSelectedInsightHeader((prev) =>
        prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleCardSelection = (index: number) => {
    setSelectedInsightCard(index);
    setIsDrillDown(true);
    setTimeout(() => {
      const cardEl = cardRefs.current[index];
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };


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
            />
          </div>
          <FilterSelector/>

          <div className={`flex flex-grow py-2 px-4 gap-4 overflow-y-auto ${!isDrillDown ? "flex-col w-full mx-auto" : ""}`}>
            <div className={`flex flex-col relative ${isDrillDown ? "w-1/3 h-full overflow-y-auto" : "w-full mx-auto"}`}>
              <div className="absolute left-8.5 top-4 h-full w-0.5 bg-[#d9d9d9] z-0" />
              {/* Overview bg-red-200/50 */}
              <div className="rounded p-4 relative z-10">
                <SectionTitle
                    title="Overview"
                    subtitle="test"
                    isExpanded={expandedSections.overview}
                    onClick={() => toggleSection("overview")}
                >
                  <OverviewComponent
                      isExpanded={expandedSections.overview}
                      isDrillDown={isDrillDown}
                  />
                </SectionTitle>
              </div>

              {/* Data-driven Insights bg-green-200/50 */}
              <div className="rounded p-4 mb-2 relative z-10">
                <SectionTitle
                    title="Data-driven Insights"
                    subtitle="test"
                    isExpanded={expandedSections.insights}
                    onClick={() => toggleSection("insights")}
                >
                  <div className={`${isDrillDown ? "flex flex-col gap-4" : "grid grid-cols-1 sm:grid-cols-2 gap-4"}`}>
                    {insightCardData.map((card, index) => (
                        <div
                            key={card.key}
                            ref={(el) => (cardRefs.current[index] = el)}
                            className="w-full"
                        >
                          <InsightCardComponent
                              insightCardData={card}
                              title={card.summaryTitle}
                              sources={card.sources}
                              isExpanded={expandedSections.insights}
                              isInsightHeaderSelected={selectedInsightHeader.includes(card.key)}
                              isInsightCardSelected={selectedInsightCard === index}
                              handleCardSelect={() => handleCardSelection(index)}
                              handleCardHeaderClick={() => handleInsightCardHeaderSelect(card.key)}
                          />
                        </div>
                    ))}
                  </div>
                </SectionTitle>
              </div>

              {/* Patient Communication bg-yellow-200/50  */}
              <div className="rounded p-4 relative z-10">
                <SectionTitle
                    title="Patient Communication"
                    subtitle="test"
                    isExpanded={expandedSections.communication}
                    onClick={() => toggleSection("communication")}
                    action={
                      <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
                        <Pencil className="w-4 h-4 mr-2" /> Draft Patient Message
                      </Button>
                    }
                >
                  <PatientCommunicationComponent
                      isDrillDown={isDrillDown}
                      selectedInsightCardTitles={selectedInsightCardTitles}
                  />
                </SectionTitle>
              </div>
            </div>

            {/* Right drilldown panel */}
            {isDrillDown && (
                <div
                    className="bg-blue-300 rounded overflow-y-auto overflow-x-hidden h-full"
                    style={{ width: rightPanelWidth }}
                >
                  <DrilldownPanel
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
        <PatientMessageDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      </>
  );
}
