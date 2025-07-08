import InsightCardComponent from "@/components/InsightCardComponent"
import { useState } from "react";
import Header from "./components/header";
import SectionTitle from "./components/section";
import type { RetrospectOptions } from "./types/props";


function App() {
  const [selectedCards, setSelectedCards] = useState<number[]>([0])
  const [isExpanded, setIsExpanded] = useState<boolean>(true)

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

  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
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


  const handleCardSelect = (index: number) => {
    setSelectedCards((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )
  }

  const handleToggleAll = () => {
    setIsExpanded((prev) => !prev)
  }

  const handleSelectAll = () => {
    setSelectedCards(selectedCards.length === cardData.length ? [] : [0, 1, 2])
  }

  const cardData = [
    {
      title: "Increased social activity, yet remains in a closed circle",
      sources: [
        { type: "passive-sensing" as const },
        { type: "clinical-notes" as const },
        { type: "patient-data" as const },
      ],
    },
    {
      title: "Growing Activity Level Despite Persistent Fatigue",
      sources: [{ type: "passive-sensing" as const }, { type: "clinical-notes" as const }],
    },
    {
      title: "Enhanced Cognitive Function and Focus",
      sources: [
        { type: "patient-data" as const },
        { type: "passive-sensing" as const },
        { type: "clinical-notes" as const },
      ],
    },
  ]

  return (
    <div className="flex flex-col h-screen">
      <Header
        patientNames={nameList}
        userName={userName}
        retrospectHorizon={retrospectHorizon}
      />

    <div className="flex-1 overflow-y-auto p-4 relative">
        {/* Connection line - spans full height of container */}
        <div className="absolute left-14.5 top-4 bottom-0 w-0.5 bg-[#d9d9d9]" />

        {/* Content with left padding to avoid overlapping the line */}
        <div className="flex flex-col gap-4 pl-6">
          <SectionTitle
            title="Overview"
            subtitle="test"
            isExpanded={expandedSections.overview}
            onClick={() => toggleSection("overview")}
          >
            {expandedSections.overview && (
              <p className="text-[#000000]">
                Insights content would go here...
              </p>
            )}
          </SectionTitle>

          <SectionTitle
            title="Data-driven Insights"
            subtitle="test"
            isExpanded={expandedSections.insights}
            onClick={() => toggleSection("insights")}
          >
            {expandedSections.insights && (
                <div className="p-8 space-y-8 bg-gray-50 min-h-screen">

                  {/* Grid with 6 columns for layout */}
                  <div className="grid grid-cols-6 gap-6">
                    {cardData.map((card, index) => {
                      const colSpan = isExpanded ? "col-span-3" : "col-span-2"

                      return (
                          <div key={index} className={`${colSpan}`}>
                            <InsightCardComponent
                                title={card.title}
                                sources={card.sources}
                                isExpanded={isExpanded}
                                isSelected={selectedCards.includes(index)}
                                onSelect={() => handleCardSelect(index)}
                                onToggle={handleToggleAll} // toggles global state
                            />
                          </div>
                      )
                    })}
                  </div>
                </div>
            )}
          </SectionTitle>

          <SectionTitle
            title="Patient Communication"
            subtitle="test"
            isExpanded={expandedSections.communication}
            onClick={() => toggleSection("communication")}
          >
            {expandedSections.communication && (
              <p className="text-[#000000]">
                Insights content would go here...
              </p>
            )}
          </SectionTitle>
        </div>
      </div>
    </div>
  );
}

export default App
