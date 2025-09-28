import OverviewComponent from "@/components/Overview/OverviewComponent";
import type { OverviewSpec } from "@/types/insightSpec";
import OverviewSummary from "../OverciewSummary";

const ChartReviewTab = ({
  overviewCardData,
}: {
  overviewCardData: OverviewSpec;
}) => {
  return (
    <div className="flex-1 gap-4 h-full w-full  py-2 px-4 flex">
      <div className="w-[240px] shrink-0 h-full overflow-y-auto">
        <OverviewSummary overviewCardData={overviewCardData} />
      </div>
      <OverviewComponent
        overviewData={overviewCardData}
        isDrillDown={false}
        isExpanded={true}
      />
    </div>
  );
};

export default ChartReviewTab;
