import OverviewSummary from "@/components/BaseLine/OverciewSummary";
import type {InsightExpandViewItem} from "@/types/props";
import InsightCardDetail from "@/components/DataInsights/InsightCardDetails";
import type { OverviewSpec } from "@/types/insightSpec";
import SurveyScoreDetail from "@/components/BaseLine/SurveyScore/SurveyScoreDetail";

interface SurveyScoreTabProps {
  showOverviewCardData?: boolean;
  overviewCardData?: OverviewSpec;
  surveyScoreFacts: InsightExpandViewItem[];
}

const SurveyScoreTab: React.FC<SurveyScoreTabProps> = ({
                                                                     showOverviewCardData=true,
                                                                     overviewCardData,
                                                           surveyScoreFacts,
                                                             }) => {
    return (
      <div className="flex gap-4 h-full py-2 px-4">
        {showOverviewCardData && overviewCardData && (
          <div className="w-[240px] shrink-0 h-full  sticky top-0 z-10">
            <OverviewSummary overviewCardData={overviewCardData} />
          </div>
        )}

        <div className="flex-1 h-full flex flex-col bg-gray-50 border rounded-xl shadow">
          {showOverviewCardData && (
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Survey Scores</h2>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <SurveyScoreDetail surveyScoreFacts={surveyScoreFacts} />
          </div>
        </div>
      </div>
    );
};


export default SurveyScoreTab;
