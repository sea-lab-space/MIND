import { useEffect, useMemo, useState, type JSX } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeaderSection from "./HeaderSection";
import SourcesSection from "./SourceSection";
import PassiveSensingCard from "./PassiveSensingCard";
import ClinicalNotesCard from "./ClinicalNotesCard";
import TranscriptCard from "./TranscriptCard";
import MeasurementScalesCard from "./MeasurementScalesCard";
import { type Encounter } from "@/types/dataTypes";
import { groupInsightsBySource } from "@/utils/helper";
import { type DatasourceIconType, type InsightCardData } from "@/types/props";
import { DatasourceIconTypes } from "@/types/props";

interface DrilldownPanelProps {
  onClose: () => void;
  insightData: InsightCardData;
  sessionInfo: Encounter[];
}

const DrilldownPanel: React.FC<DrilldownPanelProps> = ({
  onClose,
  insightData,
  sessionInfo,
}) => {
  const [linkViewsEnabled, setLinkViewsEnabled] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const cardMap = useMemo(() => {
    if (!insightData?.expandView) return {};
    const {
      passiveSensingFacts,
      clinicalNotesFacts,
      clinicalTranscriptsFacts,
      surveyScoreFacts,
    } = groupInsightsBySource(insightData.expandView);

    return {
      [DatasourceIconTypes.passiveSensing]: passiveSensingFacts?.length ? (
        <PassiveSensingCard passiveSensingFacts={passiveSensingFacts} />
      ) : null,
      [DatasourceIconTypes.surveyScore]: surveyScoreFacts?.length ? (
          <MeasurementScalesCard surveyScoreFacts={surveyScoreFacts} />
      ) : null,
      [DatasourceIconTypes.clinicalNotes]: clinicalNotesFacts?.length ? (
        <ClinicalNotesCard
          clinicalNotesFacts={clinicalNotesFacts}
          sessionInfo={sessionInfo}
        />
      ) : null,
      [DatasourceIconTypes.clinicalTranscripts]:
        clinicalTranscriptsFacts?.length ? (
          <TranscriptCard
            clinicalTranscriptsFacts={clinicalTranscriptsFacts}
            sessionInfo={sessionInfo}
          />
        ) : null,
    };
  }, [insightData, sessionInfo]);

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
            onClick={onClose}
          />
          <SourcesSection
            sources={insightData?.sources.map((source) => source.type)}
          />

          {insightData?.sources.map((source, _) => {
            return cardMap[source.type as DatasourceIconType];
          })}
          {insightData?.sources.some(
            (source) =>
              source.type === "clinical note" || source.type === "session transcript"
          ) && (
            <div className="text-sm text-gray-400">
              * Clinical notes and transcript used to motivate this insight
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DrilldownPanel;
