import OverviewSummary from "@/components/BaseLine/OverciewSummary";
import type {InsightExpandViewItem} from "@/types/props";
import InsightCardDetail from "@/components/DataInsights/InsightCardDetails";

interface MeasurementScoreTabProps {
    overviewCardData: Record<string, string>;
    measurementScoreFacts: InsightExpandViewItem[];
}

const MeasurementScoreTab: React.FC<MeasurementScoreTabProps> = ({
                                                                 overviewCardData,
                                                                     measurementScoreFacts,
                                                             }) => {
    return (
        <div className="flex gap-4 h-full">
            {/* Left column: scrollable independently */}
            <div className="w-[260px] shrink-0 h-full overflow-y-auto">
                <OverviewSummary basicInfoCardData={overviewCardData} />
            </div>

            {/* Right column: scrollable content */}
            <div className="flex-1 h-full flex flex-col overflow-y-auto bg-gray-50 border rounded-xl shadow">
                {/* Static (non-scrolling) header */}
                <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold">Measurement Scores</h2>
                    {/*<p className="mt-2 text-sm text-muted-foreground">*/}
                    {/*    Visualization of passive data goes here.*/}
                    {/*</p>*/}
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <InsightCardDetail insightCardDataExpandView={measurementScoreFacts}/>
                </div>
            </div>
        </div>
    );
};


export default MeasurementScoreTab;
