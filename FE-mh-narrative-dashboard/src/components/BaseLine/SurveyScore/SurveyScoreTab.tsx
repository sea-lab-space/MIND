import OverviewSummary from "@/components/BaseLine/OverciewSummary";
import type {InsightExpandViewItem} from "@/types/props";
import InsightCardDetail from "@/components/DataInsights/InsightCardDetails";

interface SurveyScoreTabProps {
    showOverviewCardData?: boolean,
    overviewCardData: Record<string, string>;
    surveyScoreFacts: InsightExpandViewItem[];
}

const SurveyScoreTab: React.FC<SurveyScoreTabProps> = ({
                                                                     showOverviewCardData=true,
                                                                     overviewCardData,
                                                           surveyScoreFacts,
                                                             }) => {
    return (
        <div className="flex gap-4 h-full">
            {/* Left column: scrollable independently */}
            {
                showOverviewCardData && <div className="w-[260px] shrink-0 h-full overflow-y-auto">
                    <OverviewSummary basicInfoCardData={overviewCardData} />
                </div>
            }

            {/* Right column: scrollable content */}
            <div className="flex-1 h-full flex flex-col overflow-y-auto bg-gray-50 border rounded-xl shadow">
                {/* Static (non-scrolling) header */}
                {
                    showOverviewCardData &&
                    <div className="p-4 border-b">
                        <h2 className="text-lg font-semibold">Survey Scores</h2>
                    </div>
                }


                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <InsightCardDetail insightCardDataExpandView={surveyScoreFacts}/>
                </div>
            </div>
        </div>
    );
};


export default SurveyScoreTab;
