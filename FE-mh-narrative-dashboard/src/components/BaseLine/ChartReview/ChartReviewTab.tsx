import OverviewSummary from "@/components/BaseLine/OverciewSummary";
import OverviewComponent from "@/components/Overview/OverviewComponent";

const ChartReviewTab = ({ overviewCardData, insightCardData }) => {
    return (
        <div className="flex gap-4 h-full">
            {/* Left Overview */}
            {/*<div className="w-[260px] shrink-0 h-full overflow-y-auto">*/}
            {/*    <OverviewSummary basicInfoCardData={overviewCardData} />*/}
            {/*</div>*/}

            {/*/!* Right Content *!/*/}
            {/*<div className="flex-1 overflow-y-auto p-4 bg-gray-50 border rounded-xl shadow">*/}
            {/*    <h2 className="text-lg font-semibold">Chart Review</h2>*/}
            {/*    /!* Use insightCardData here *!/*/}
            {/*    <p className="mt-2 text-sm text-muted-foreground">*/}
            {/*        Chart insights and timeline here.*/}
            {/*    </p>*/}
            {/*</div>*/}
            <OverviewComponent overviewData={overviewCardData} isDrillDown={false} isExpanded={true}/>
        </div>
    );
};

export default ChartReviewTab;
