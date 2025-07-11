import InsightCardComponent from "@/components/DataInsights/InsightCardComponent";
import { useState, useRef } from "react";
import Header from "./components/header";
import SectionTitle from "./components/section";
import { DatasourceIconTypes, type RetrospectOptions } from "./types/props";
import DrilldownPanel from "./components/DrilldownPanel";
import OverviewComponent from "@/components/Overview/OverviewComponent";
import patientCommunicationComponent from "@/components/PatientCommunication/PatientCommunicationComponent";
import PatientInsightHeaderCard from "@/components/PatientCommunication/PatientInsightHeaderCard";
import PatientCommunicationComponent from "@/components/PatientCommunication/PatientCommunicationComponent";
import {useWindowSize} from "usehooks-ts";



  const nameList = [
    "John Doe",
    "Jane Smith",
    "Mike Johnson",
    "Sarah Wilson",
    "David Brown",
    "Lisa Davis",
    "Tom Miller",
    "Emma Garcia",
    "Alex Martinez",
    "Olivia Taylor",
  ];

  const userName = "Ryan";
  const retrospectHorizon: RetrospectOptions = {
    "Since last encounter": 14,
    "Last month": 30,
    "Last 3 months": 90,
    "Last 6 months": 180,
    "Last year": 365,
  };

export default function App() {
  const [selectedInsightHeader, setSelectedInsightHeader] = useState<number[]>([]);
  const [selectedInsightCard, setSelectedInsightCard] = useState<number | null>(null);
  const [isDrillDown, setIsDrillDown] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    overview: false,
    insights: false,
    communication: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { width: windowWidth } = useWindowSize();
  const rightPanelWidth = isDrillDown ? Math.max((windowWidth * 2) / 3, 800) : 0;

  const handleInsightCardHeaderSelect = (index: number) => {
    setSelectedInsightHeader((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleCardSelection = (index: number) => {
    setSelectedInsightCard(index);
    setIsDrillDown(true);
    setTimeout(() => {
      const cardEl = cardRefs.current[index];
      if (cardEl) {
        cardEl.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  const cardData = [
    {
      title: "Increased social activity, yet remains in a closed circle",
      sources: [
        { type: DatasourceIconTypes.measurementScore },
        { type: DatasourceIconTypes.clinicalNotes },
        { type: DatasourceIconTypes.clinicalTranscripts },
      ],
    },
    {
      title: "Growing Activity Level Despite Persistent Fatigue",
      sources: [
        { type: DatasourceIconTypes.measurementScore },
        { type: DatasourceIconTypes.clinicalNotes },
      ],
    },
    {
      title: "Enhanced Cognitive Function and Focus",
      sources: [
        { type: DatasourceIconTypes.measurementScore },
        { type: DatasourceIconTypes.clinicalNotes },
        { type: DatasourceIconTypes.clinicalTranscripts },
        { type: DatasourceIconTypes.passiveSensing },
      ],
    },
  ];

  return (
      <div className="flex flex-col h-screen bg-gray-50">
        {/* Sticky Header */}
        <div className="sticky top-0 z-50 bg-gray-50 shadow-md">
          <Header
              patientNames={nameList}
              userName={userName}
              retrospectHorizon={retrospectHorizon}
          />
        </div>

        {/* Main content area below header */}
        <div
            className={`flex flex-grow p-6 gap-6 overflow-y-auto ${
                !isDrillDown ? "flex-col w-full mx-auto" : ""
            }`}
        >
          {/* Left panel */}
          <div
              className={`flex flex-col relative ${
                  isDrillDown ? "w-1/3 h-full overflow-y-auto" : "w-full mx-auto"
              }`}
          >
            {/* Connection line (only in drilldown mode) */}
                <div className="absolute left-8.5 top-4 h-full w-0.5 bg-[#d9d9d9] z-0" />
            {/* Section 1 */}
            <div className="bg-red-200/50 rounded p-4 mb-6 relative z-10">
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

            {/* Section 2 */}
            <div className="bg-green-200/50 rounded p-4 mb-6 relative z-10">
              <SectionTitle
                  title="Data-driven Insights"
                  subtitle="test"
                  isExpanded={expandedSections.insights}
                  onClick={() => toggleSection("insights")}
              >
                <div
                    className={`${
                        isDrillDown
                            ? "flex flex-col gap-6"
                            : "grid grid-cols-1 sm:grid-cols-2 gap-6"
                    }`}
                >
                  {cardData.map((card, index) => (
                      <div
                          key={index}
                          ref={(el) => {
                            cardRefs.current[index] = el;
                          }}
                          className="w-full"
                      >
                        <InsightCardComponent
                            title={card.title}
                            sources={card.sources}
                            isExpanded={expandedSections.insights}
                            isInsightHeaderSelected={selectedInsightHeader.includes(index)}
                            isInsightCardSelected={selectedInsightCard === index}
                            handleCardSelect={() => handleCardSelection(index)}
                            handleCardHeaderClick={() =>
                                handleInsightCardHeaderSelect(index)
                            }
                        />
                      </div>
                  ))}
                </div>
              </SectionTitle>
            </div>

            {/* Section 3 */}
            <div className="bg-yellow-200/50 rounded p-4 relative z-10">
              <SectionTitle
                  title="Patient Communication"
                  subtitle="test"
                  isExpanded={expandedSections.communication}
                  onClick={() => toggleSection("communication")}
              >
                <PatientCommunicationComponent isDrillDown={isDrillDown} />
              </SectionTitle>
            </div>
          </div>


          {/* Right panel (drilldown) */}
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
  );
}