import { useState } from "react";
import { useWindowSize } from "usehooks-ts";
import Header from "./components/header";
import SectionTitle from "./components/section";
import type { RetrospectOptions } from "./types/props";

function App() {

  const { width = 0, height = 0 } = useWindowSize();

  console.log(height)

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
              <p className="text-[#000000]">
                Insights content would go here...
              </p>
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

export default App;
