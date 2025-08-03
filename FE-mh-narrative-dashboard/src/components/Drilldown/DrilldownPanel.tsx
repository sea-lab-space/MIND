import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeaderSection from "./HeaderSection";
import SourcesSection from "./SourceSection";
import PassiveSensingCard from "./PassiveSensingCard";
import ClinicalNotesCard from "./ClinicalNotesCard";
import TranscriptCard from "./TranscriptCard";
import MeasurementScalesCard from "./MeasurementScalesCard";
import type {Encounter, InsightCard} from "@/types/dataTypes";
import {groupInsightsBySource} from "@/utils/helper";
import type {InsightExpandViewItem} from "@/types/props";

interface DrilldownPanelProps {
  onClose: () => void;
  insightData: InsightCard;
  sessionInfo: Encounter[]
}

const DrilldownPanel: React.FC<DrilldownPanelProps> = ({ onClose, insightData, sessionInfo }) => {
  const [linkViewsEnabled, setLinkViewsEnabled] = useState(true);
    const {
        passiveSensingFacts = [],
        clinicalNotesFacts = [],
        clinicalTranscriptsFacts = [],
        measurementScoreFacts = [],
    }: {
        passiveSensingFacts?: InsightExpandViewItem[];
        clinicalNotesFacts?: InsightExpandViewItem[];
        clinicalTranscriptsFacts?: InsightExpandViewItem[];
        measurementScoreFacts?: InsightExpandViewItem[];
    } = groupInsightsBySource(insightData?.expandView);

  return (
      <div className="flex-1">
        <div className="absolute z-10 items-center justify-center bottom-1/2 top-1/2">
          <Button
              variant="secondary"
              size="icon"
              className="full bg-white shadow-md transition-all hover:bg-gray-100 hover:shadow-lg w-5 h-20 rounded-none rounded-tr-md rounded-br-md border-l-2 border-gray-300"
              onClick={onClose}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        <div className="bg-gray-100 p-8 w-full border-l-2 border-gray-300">
          <div className="w-full max-w-[1800px] mx-auto space-y-2">
            <HeaderSection
                linkViewsEnabled={linkViewsEnabled}
                setLinkViewsEnabled={setLinkViewsEnabled}
                title={insightData.summaryTitle}
            />
            <SourcesSection sources={insightData?.sources}/>
              {passiveSensingFacts?.length > 0 && (
                  <PassiveSensingCard passiveSensingFacts={passiveSensingFacts} />
              )}
              {clinicalNotesFacts?.length > 0 && (
                  <ClinicalNotesCard clinicalNotesFacts={clinicalNotesFacts} sessionInfo={sessionInfo}/>
              )}
              {clinicalTranscriptsFacts?.length > 0 && (
                  <TranscriptCard clinicalTranscriptsFacts={clinicalTranscriptsFacts} sessionInfo={sessionInfo}/>
              )}
              {measurementScoreFacts?.length > 0 && (
                  <MeasurementScalesCard measurementScoreFacts={measurementScoreFacts} />
              )}
          </div>
        </div>
      </div>
  );
};

export default DrilldownPanel;
