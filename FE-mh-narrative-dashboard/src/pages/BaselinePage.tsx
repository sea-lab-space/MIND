import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import  { useState, useEffect } from "react";
import { nameList, nameListMap, retrospectHorizon } from "@/data/data";
import Header from "@/components/header";
import { getVisualizerDataForPerson } from "@/utils/dataConversion";
import PassiveSensingTab from "@/components/BaseLine/PassiveSensing/PassiveSensingTab";
import ChartReviewTab from "@/components/BaseLine/ChartReview/ChartReviewTab";
import * as React from "react";
import ClinicalNotesTab from "@/components/BaseLine/ClinicalNotes/ClinicalNotesTab";
import {flattenAllExpandViews, getUserFromHashUrl, groupInsightsBySource} from "@/utils/helper";
import type {InsightExpandViewItem} from "@/types/props";
import TranscriptionTab from "@/components/BaseLine/Transcription/TranscriptionTab";
import SurveyScoreTab from "@/components/BaseLine/SurveyScore/SurveyScoreTab";
import { useParams } from "react-router-dom";
import type { TabItem, TabKey } from "@/types/dataTypes";




export default function BaselinePage() {
  const { patientId } = useParams<{
    patientId: string;
  }>();
  const [selectedPatient, setSelectedPatient] =
    useState<string>("Gabriella Lin");

  useEffect(() => {
    if (patientId) {
      if (Object.keys(nameListMap).includes(patientId)) {
        setSelectedPatient(nameListMap[patientId]);
      } else {
        alert("Invalid patient ID");
      }
    }
  }, [patientId]);

    const [activeTab, setActiveTab] = useState<TabKey>("chart-review");

    const { overviewCardData, insightCardData, session_subjective_info, survey_data } = getVisualizerDataForPerson(selectedPatient);
    const allExpandViews = flattenAllExpandViews(insightCardData);

    const {
        passiveSensingFacts = [],
    }: {
        passiveSensingFacts?: InsightExpandViewItem[];
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
            component: <PassiveSensingTab overviewCardData={overviewCardData} passiveSensingFacts={passiveSensingFacts}/>,
        },
        {
            key: "clinical-notes",
            label: "Clinical Notes",
            component: <ClinicalNotesTab overviewCardData={overviewCardData} clinicalNotesFacts={session_subjective_info}/>,
        },
        {
            key: "transcription",
            label: "Transcription",
            component: <TranscriptionTab overviewCardData={overviewCardData} clinicalTranscriptsFacts={session_subjective_info}/>,
        },
        {
            key: "survey-score",
            label: "Survey Score",
            component: <SurveyScoreTab overviewCardData={overviewCardData} surveyScoreFacts={survey_data}/>,
        },
    ];

    const userName = getUserFromHashUrl()
    return (
      <div className="flex flex-col h-screen">
        {/* Sticky Header */}
        <div className="sticky top-0 z-50 bg-gray-50 shadow-md mb-2">
          <Header
            isHomePage={false}
            patientNames={nameList}
            userName={userName}
            retrospectHorizon={retrospectHorizon}
            selectedPatient={selectedPatient}
            setSelectedPatient={setSelectedPatient}
            disabled={patientId ? true : false}
          />
        </div>

        {/* Page Content */}
        <div className="h-[calc(100vh-100px)] w-screen p-2 flex flex-grow px-4 gap-4">
          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as TabKey)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-5 mb-4 sticky top-0 z-10">
              {tabItems.map((tab) => (
                <TabsTrigger key={tab.key} value={tab.key}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="overflow-y-auto">
              {/* Tab Contents without overview or layout */}
              {tabItems.map((tab) => (
                <TabsContent key={tab.key} value={tab.key}>
                  {tab.component}
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>
      </div>
    );
}
