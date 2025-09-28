import { useState, type JSX } from "react";
import { Watch, MessageSquare, StickyNote, ClipboardList } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {DatasourceIconTypes, type DatasourceIconType, type InsightExpandViewItem} from "@/types/props";
import {getVisualizerDataForPerson} from "@/utils/dataConversion";
import {flattenAllExpandViews, groupInsightsBySource} from "@/utils/helper";
import PassiveSensingTab from "@/components/BaseLine/PassiveSensing/PassiveSensingTab";
import ClinicalNotesTab from "@/components/BaseLine/ClinicalNotes/ClinicalNotesTab";
import SurveyScoreTab from "@/components/BaseLine/SurveyScore/SurveyScoreTab";
import TranscriptionTab from "@/components/BaseLine/Transcription/TranscriptionTab";

const dataSourceIconConfig: Record<DatasourceIconType, { icon: JSX.Element; color: string }> = {
    [DatasourceIconTypes.passiveSensing]: {
        icon: <Watch className="w-5 h-5" />,
        color: "text-slate-500"
    },
    [DatasourceIconTypes.clinicalTranscripts]: {
        icon: <MessageSquare className="w-5 h-5" />,
        color: "text-emerald-500"
    },
    [DatasourceIconTypes.clinicalNotes]: {
        icon: <StickyNote className="w-5 h-5" />,
        color: "text-orange-500"
    },
    [DatasourceIconTypes.surveyScore]: {
        icon: <ClipboardList className="w-5 h-5" />,
        color: "text-yellow-500"
    }
};


export default function DataSourceIconModalButtons({selectedPatient}: {selectedPatient: string}) {
    const [openType, setOpenType] = useState<DatasourceIconType | null>(null);

    const { overviewCardData, insightCardData, session_subjective_info, survey_data } = getVisualizerDataForPerson(selectedPatient);
    const allExpandViews = flattenAllExpandViews(insightCardData);

    const {
        passiveSensingFacts = [],
    }: {
        passiveSensingFacts?: InsightExpandViewItem[];
    } = groupInsightsBySource(allExpandViews);


    const modalContentMap: Record<
        DatasourceIconType,
        { title: string; ContentComponent: React.ComponentType<any> }
        > = {
        [DatasourceIconTypes.passiveSensing]: {
            title: "Passive Sensing",
            ContentComponent: () => <PassiveSensingTab passiveSensingFacts={passiveSensingFacts} showOverviewCardData={false} />,
        },
        [DatasourceIconTypes.clinicalNotes]: {
            title: "Clinical Notes",
            ContentComponent: () => <ClinicalNotesTab clinicalNotesFacts={session_subjective_info} showOverviewCardData={false} />,
        },
        [DatasourceIconTypes.surveyScore]: {
            title: "Survey Scores",
            ContentComponent: () => <SurveyScoreTab showOverviewCardData={false} surveyScoreFacts={survey_data}/>,
        },
        [DatasourceIconTypes.clinicalTranscripts]: {
            title: "Clinical Transcripts",
            ContentComponent: () => <TranscriptionTab showOverviewCardData={false} clinicalTranscriptsFacts={session_subjective_info}/>,
        },
    };


    return (
        <div className="flex items-center gap-1">
            {(Object.entries(dataSourceIconConfig) as [DatasourceIconType, { icon: JSX.Element; color: string }][]).map(
                ([type, { icon, color }]) => {
                    const modalData = modalContentMap[type];
                    if (!modalData) return null; // safeguard

                    const { title, ContentComponent } = modalData;

                    return (
                        <Dialog
                            key={type}
                            open={openType === type}
                            onOpenChange={(open) => setOpenType(open ? type : null)}
                        >
                            <DialogTrigger asChild>
                                <Button variant="ghost" className={`h-6 w-6 ${color}`}>
                                    {icon}
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="!max-w-6xl w-[1100px] max-h-[80vh] overflow-auto">
                                <DialogHeader>
                                    <DialogTitle>{title}</DialogTitle>
                                </DialogHeader>
                                <div className="mt-2">
                                    <ContentComponent />
                                </div>
                            </DialogContent>
                        </Dialog>
                    );
                }
            )}
        </div>
    );

}
