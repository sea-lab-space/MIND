import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import  { useState } from "react";
import { nameList, retrospectHorizon } from "@/data/data";
import Header from "@/components/header";
import { getVisualizerDataForPerson } from "@/utils/dataConversion";
import PassiveSensingTab from "@/components/BaseLine/PassiveSensing/PassiveSensingTab";
import ChartReviewTab from "@/components/BaseLine/ChartReview/ChartReviewTab";
import * as React from "react";
import ClinicalNotesTab from "@/components/BaseLine/ClinicalNotes/ClinicalNotesTab";
import {flattenAllExpandViews, groupInsightsBySource} from "@/utils/helper";
import type {InsightExpandViewItem} from "@/types/props";
import TranscriptionTab from "@/components/BaseLine/Transcription/TranscriptionTab";
import MeasurementScoreTab from "@/components/BaseLine/MeasurementScore/MeasurementScoreTab";

export type TabKey =
    | "chart-review"
    | "measurement-score"
    | "passive-sensing"
    | "transcription"
    | "clinical-notes";

type TabItem = {
    key: TabKey;
    label: string;
    component: React.ReactNode;
};


export default function BaselinePage() {
    const [activeTab, setActiveTab] = useState<TabKey>("chart-review");
    const [selectedPatient, setSelectedPatient] = useState<string>("Gabriella Lin");

    const { overviewCardData, insightCardData } = getVisualizerDataForPerson(selectedPatient);
    const allExpandViews = flattenAllExpandViews(insightCardData);

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
    } = groupInsightsBySource(allExpandViews);

    const tabItems: TabItem[] = [
        {
            key: "chart-review",
            label: "Chart Review",
            component: (
                <ChartReviewTab overviewCardData={overviewCardData} />
            ),
        },
        {
            key: "passive-sensing",
            label: "Passive Sensing Data",
            component: <PassiveSensingTab overviewCardData={overviewCardData?.basicInfoCard} passiveSensingFacts={passiveSensingFacts}/>,
        },
        {
            key: "clinical-notes",
            label: "Clinical Notes",
            component: <ClinicalNotesTab overviewCardData={overviewCardData?.basicInfoCard} clinicalNotesFacts={clinicalNotesFacts[0]}/>,
        },
        {
            key: "transcription",
            label: "Transcription",
            component: <TranscriptionTab overviewCardData={overviewCardData?.basicInfoCard} clinicalTranscriptsFacts={clinicalTranscriptsFacts[0]}/>,
        },
        {
            key: "measurement-score",
            label: "Measurement Score",
            component: <MeasurementScoreTab overviewCardData={overviewCardData?.basicInfoCard} measurementScoreFacts={measurementScoreFacts}/>,
        },
    ];

    return (
        <div className="h-screen w-screen bg-white">
            {/* Sticky Header */}
            <div className="sticky top-0 z-50 bg-gray-50 shadow-md mb-2">
                <Header
                    isHomePage={false}
                    patientNames={nameList}
                    userName={"Ryan"}
                    retrospectHorizon={retrospectHorizon}
                    selectedPatient={selectedPatient}
                    setSelectedPatient={setSelectedPatient}
                />
            </div>

            {/* Page Content */}
            <div className="h-[calc(100vh-100px)] w-screen p-2">
                <div className="flex flex-col h-full overflow-y-auto px-4 gap-4">
                    {/* Tabs */}
                    <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as TabKey)} className="w-full">
                        <TabsList className="grid w-full grid-cols-5 mb-4">
                            {tabItems.map((tab) => (
                                <TabsTrigger key={tab.key} value={tab.key}>
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {/* Tab Contents without overview or layout */}
                        {tabItems.map((tab) => (
                            <TabsContent key={tab.key} value={tab.key}>
                                {tab.component}
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
