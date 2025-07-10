import InsightCardComponent from "@/components/InsightCardComponent";
import { useState, useRef } from "react";
import Header from "./components/header";
import SectionTitle from "./components/section";
import { DatasourceIconTypes, type RetrospectOptions } from "./types/props";
import DrilldownPanel from "./components/DrilldownPanel";
import OverviewComponent from "@/components/OverviewComponent";

function App() {
  const [selectedInsightHeader, setSelectedInsightHeader] = useState<number[]>([]);
  const [selectedInsightCard, setSelectedInsightCard] = useState<number | null>(null);
  const [isDrillDown, setIsDrillDown] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    overview: false,
    insights: false,
    communication: false,
  });

  const handleInsightCardHeaderSelect = (index: number) => {
    setSelectedInsightHeader((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleCardSelection = (index: number) => {
    setSelectedInsightCard(index);
    setIsDrillDown(true);
    setTimeout(() => {
      const cardEl = cardRefs.current[index];
      if (cardEl) {
        cardEl.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 100);
  };

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

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
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
      <div className="flex flex-col h-screen overflow-hidden">
        <Header
            patientNames={nameList}
            userName={userName}
            retrospectHorizon={retrospectHorizon}
        />

        {/* Main content container */}
        <div className="w-full flex flex-1 bg-white min-h-0 flex-col sm:flex-row">
          <div
              className={`overflow-y-scroll p-4 ${
                  isDrillDown ? "basis-full sm:basis-1/3 flex-none" : "basis-full flex-none"
              }`}
          >
            <div className="w-full">
              {/*<div className="left-10 inset-y-0 w-0.5 bg-[#d9d9d9]" />*/}
              <div className="flex flex-col gap-4 pl-6">
                <SectionTitle
                    title="Overview"
                    subtitle="test"
                    isExpanded={expandedSections.overview}
                    onClick={() => toggleSection("overview")}
                >
                  <OverviewComponent isExpanded={expandedSections.overview} />
                </SectionTitle>

                <SectionTitle
                    title="Data-driven Insights"
                    subtitle="test"
                    isExpanded={expandedSections.insights}
                    onClick={() => toggleSection("insights")}
                >
                  <div className="p-8 space-y-8 bg-gray-50 w-full">
                    <div className="grid grid-cols-6 gap-6 w-full">
                      {cardData.map((card, index) => {
                        const colSpan = isDrillDown
                            ? "col-span-6"
                            : expandedSections.insights
                                ? "col-span-3"
                                : "col-span-2";
                        return (
                            <div
                                key={index}
                                ref={(el) => (cardRefs.current[index] = el)}
                                className={`${colSpan} w-full`}
                            >
                              <InsightCardComponent
                                  title={card.title}
                                  sources={card.sources}
                                  isExpanded={expandedSections.insights}
                                  isInsightHeaderSelected={selectedInsightHeader.includes(index)}
                                  isInsightCardSelected={selectedInsightCard === index}
                                  handleCardSelect={() => handleCardSelection(index)}
                                  handleCardHeaderClick={() => handleInsightCardHeaderSelect(index)}
                              />
                            </div>
                        );
                      })}
                    </div>
                  </div>
                </SectionTitle>

                <SectionTitle
                    title="Patient Communication"
                    subtitle="test"
                    isExpanded={expandedSections.communication}
                    onClick={() => toggleSection("communication")}
                >
                  {expandedSections.communication && (
                      <p className="text-[#000000]">Insights content would go here...</p>
                  )}
                </SectionTitle>
              </div>
            </div>
          </div>

          {/* Right panel: drilldown, only show when isDrillDown true */}
          {isDrillDown && (
              <div className="overflow-y-scroll overflow-x-hidden basis-full sm:basis-2/3 flex-none">
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

export default App;
