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
      {/* Left Overview */}
      <div className="w-[240px] shrink-0 h-full overflow-y-auto">
        <OverviewSummary overviewCardData={overviewCardData} />
      </div>

      {/* Right Content */}
      {/* <div className="flex-1 overflow-y-auto p-4 bg-gray-50 border rounded-xl shadow">
        <h2 className="text-lg font-semibold">Chart Review</h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Chart insights and timeline here.
        </p>
      </div> */}
      <OverviewComponent
        overviewData={overviewCardData}
        isDrillDown={false}
        isExpanded={true}
      />
    </div>
  );
};

export default ChartReviewTab;
