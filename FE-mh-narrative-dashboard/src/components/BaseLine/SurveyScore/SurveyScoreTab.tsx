import OverviewSummary from "@/components/BaseLine/OverciewSummary";
import type {InsightExpandViewItem} from "@/types/props";
import InsightCardDetail from "@/components/DataInsights/InsightCardDetails";
import type { OverviewSpec } from "@/types/insightSpec";

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
        {/* Left column: scrollable independently */}
        {showOverviewCardData &&
          overviewCardData && (
            <div className="w-[260px] shrink-0 h-full  sticky top-0 z-10">
              <OverviewSummary overviewCardData={overviewCardData} />
            </div>
          )}

        {/* Right column: scrollable content */}
        <div className="flex-1 h-full flex flex-col bg-gray-50 border rounded-xl shadow">
          {/* Static (non-scrolling) header */}
          {showOverviewCardData && (
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Survey Scores</h2>
            </div>
          )}

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <InsightCardDetail
              insightCardDataExpandView={surveyScoreFacts}
              isBaseline={true}
            />
          </div>
        </div>
      </div>
    );
};


export default SurveyScoreTab;
