import {useEffect, useState, type JSX} from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/header";
import { getVisualizerDataForPerson } from "@/utils/dataConversion";
import { flattenAllExpandViews, getUserFromHashUrl, groupInsightsBySource } from "@/utils/helper";
import PassiveSensingTab from "@/components/BaseLine/PassiveSensing/PassiveSensingTab";
import ClinicalNotesTab from "@/components/BaseLine/ClinicalNotes/ClinicalNotesTab";
import TranscriptionTab from "@/components/BaseLine/Transcription/TranscriptionTab";
import SurveyScoreTab from "@/components/BaseLine/SurveyScore/SurveyScoreTab";
import MINDTab from "@/pages/MINDTab";
import { Watch, MessageSquare, StickyNote, ClipboardList } from "lucide-react";
import type { TabItem, HomePageTabKey } from "@/types/dataTypes";
import {nameListMap, retrospectHorizon} from "@/data/data";
import TabsView from "@/components/TabsView/TabsView";

export default function HomePage() {
    const { patientId } = useParams<{ patientId: string }>();
    const [selectedPatient, setSelectedPatient] = useState("Gabriella Lin");
    const [invalidPatient, setInvalidPatient] = useState(false);
    const userName = getUserFromHashUrl();

    const { overviewCardData, insightCardData, session_subjective_info, survey_data, suggested_activity_data} = getVisualizerDataForPerson(selectedPatient);
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
                <p>The patient ID you entered is invalid. Please type in a url with valid patient name.</p>
                {/* <button onClick={() => setInvalidPatient(false)}>Go Back</button> */}
            </div>
        );
    }

    const tabIconConfig: Partial<Record<HomePageTabKey, { icon: JSX.Element; color: string }>> = {
        "passive-sensing": { icon: <Watch className="w-5 h-5" />, color: "text-slate-500" },
        "clinical-notes": { icon: <StickyNote className="w-5 h-5" />, color: "text-yellow-500" },
        "transcripts": { icon: <MessageSquare className="w-5 h-5" />, color: "text-emerald-500" },
        "survey-scores": { icon: <ClipboardList className="w-5 h-5" />, color: "text-orange-500" },
    };

    const makeTab = (
        key: HomePageTabKey,
        label: string,
        Component: React.ElementType,
        extraProps: Record<string, unknown> = {}
    ): TabItem => {
        const iconConfig = tabIconConfig[key];
        return {
            key,
            label: (
                <div className="flex items-center gap-2">
                    {iconConfig && <span className={iconConfig.color}>{iconConfig.icon}</span>}
                    <span>{label}</span>
                </div>
            ),
            component: <Component overviewCardData={overviewCardData} {...extraProps} />,
        };
    };

    const tabItems: TabItem[] = [
        makeTab("mind", "MIND", MINDTab, {selectedPatient}),
        makeTab("survey-scores", "Survey Scores", SurveyScoreTab, { surveyScoreFacts: survey_data }),
        makeTab("clinical-notes", "Clinical Notes", ClinicalNotesTab, { clinicalNotesFacts: session_subjective_info }),
        makeTab("transcripts", "Transcripts", TranscriptionTab, { clinicalTranscriptsFacts: session_subjective_info }),
        makeTab("passive-sensing", "Passive Sensing Data", PassiveSensingTab, { passiveSensingFacts }),

    ];

    return (
        <div className="flex flex-col h-screen">
            {/* Sticky Header */}
            <div className="sticky top-0 z-50 shadow-md mb-2">
                <Header
                    isHomePage
                    patientNames={Object.values(nameListMap)}
                    userName={userName}
                    retrospectHorizon={retrospectHorizon}
                    selectedPatient={selectedPatient}
                    setSelectedPatient={setSelectedPatient}
                    disabled={!!patientId}
                />
            </div>

            {/* Tab View fills the rest */}
            <div className="flex-1 min-h-0 flex">
                <TabsView
                    tabItems={tabItems}
                    defaultTab="mind"
                    isMIND={true}
                />
            </div>
        </div>
    );
}
