import { useParams } from "react-router-dom";
import Header from "@/components/header";
import { getVisualizerDataForPerson } from "@/utils/dataConversion";
import { flattenAllExpandViews, getUserFromHashUrl, groupInsightsBySource } from "@/utils/helper";
import PassiveSensingTab from "@/components/BaseLine/PassiveSensing/PassiveSensingTab";
import ChartReviewTab from "@/components/BaseLine/ChartReview/ChartReviewTab";
import ClinicalNotesTab from "@/components/BaseLine/ClinicalNotes/ClinicalNotesTab";
import TranscriptionTab from "@/components/BaseLine/Transcription/TranscriptionTab";
import SurveyScoreTab from "@/components/BaseLine/SurveyScore/SurveyScoreTab";
import { Watch, MessageSquare, StickyNote, ClipboardList, History } from "lucide-react";
import type { TabItem, TabKey } from "@/types/dataTypes";
import {nameListMap, retrospectHorizon} from "@/data/data";
import {useEffect, useState, type JSX} from "react";
import TabsView from "@/components/TabsView/TabsView";
import DataSourceIcon from "@/components/DatasourceIcon";

export default function BaselinePage() {
    const { patientId } = useParams<{ patientId: string }>();
    const [selectedPatient, setSelectedPatient] = useState("Gabriella Lin");
    const [invalidPatient, setInvalidPatient] = useState(false);
    const userName = getUserFromHashUrl();

    const { overviewCardData, insightCardData, session_subjective_info, survey_data } = getVisualizerDataForPerson(selectedPatient);
    const allExpandViews = flattenAllExpandViews(insightCardData);
    const { passiveSensingFacts = [] }: { passiveSensingFacts?: any[] } = groupInsightsBySource(allExpandViews);

    useEffect(() => {
        if (patientId) {
            if (Object.keys(nameListMap).includes(patientId)) {
                setSelectedPatient(nameListMap[patientId]);
                setInvalidPatient(false);
            } else {
                setInvalidPatient(true);
            }
        }
    }, [patientId]);

    if (invalidPatient) {
        return (
            <div>
                <h1>Patient Not Found</h1>
                <p>The patient ID you entered is invalid. Please select a valid patient.</p>
                <button onClick={() => setInvalidPatient(false)}>Go Back</button>
            </div>
        );
    }

    const tabIconConfig: Partial<
      Record<TabKey, { icon: JSX.Element; color: string }>
    > = {
      "chart-review": {
        icon: <History className="w-5 h-5" />,
        color: "grey-500",
      },
      "survey-scores": {
        icon: <DataSourceIcon iconType="survey" showType forcePlainColor />,
        color: "text-orange-500",
      },
      "clinical-notes": {
        icon: (
          <DataSourceIcon iconType="clinical note" showType forcePlainColor />
        ),
        color: "text-yellow-500",
      },
      transcripts: {
        icon: (
          <DataSourceIcon
            iconType="session transcript"
            showType
            forcePlainColor
          />
        ),
        color: "text-emerald-500",
      },
      "passive-sensing": {
        icon: (
          <DataSourceIcon iconType="passive sensing" showType forcePlainColor />
        ),
        color: "text-slate-500",
      },
    };

    const makeTab = (
        key: TabKey,
        label: string,
        Component: React.ElementType,
        extraProps: Record<string, unknown> = {}
    ): TabItem => {
        const iconConfig = tabIconConfig[key];
        return {
          key,
          label: (
            <div className="flex items-center gap-2">
              {iconConfig && (
                <span className="font-bold">{iconConfig.icon}</span>
              )}
              {label === "Patient Summary" && <span className="font-bold">{label}</span>}
            </div>
          ),
          component: (
            <Component overviewCardData={overviewCardData} {...extraProps} />
          ),
        };
    };

    const tabItems: TabItem[] = [
        makeTab("chart-review", "Patient Summary", ChartReviewTab),
        makeTab("survey-scores", "Survey Scores", SurveyScoreTab, { surveyScoreFacts: survey_data }),
        makeTab("clinical-notes", "Clinical Notes", ClinicalNotesTab, { clinicalNotesFacts: session_subjective_info }),
        makeTab("transcripts", "Transcripts", TranscriptionTab, { clinicalTranscriptsFacts: session_subjective_info }),
        makeTab("passive-sensing", "Passive Sensing Data", PassiveSensingTab, { passiveSensingFacts }),
    ];

    return (
        <div className="flex flex-col h-screen">
            <div className="sticky top-0 z-50 shadow-md mb-2">
                <Header
                    isHomePage={false}
                    patientNames={Object.values(nameListMap)}
                    userName={userName}
                    retrospectHorizon={retrospectHorizon}
                    selectedPatient={selectedPatient}
                    setSelectedPatient={setSelectedPatient}
                    disabled={!!patientId}
                />
            </div>

            <div className="h-[calc(100vh-85px)] w-screen flex">
                <TabsView tabItems={tabItems} defaultTab="chart-review" isMIND={false}/>
            </div>
        </div>
    );
}
