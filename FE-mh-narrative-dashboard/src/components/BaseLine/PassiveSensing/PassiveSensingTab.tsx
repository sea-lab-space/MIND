import OverviewSummary from "@/components/BaseLine/OverciewSummary";
import type {InsightExpandViewItem} from "@/types/props";
import InsightCardDetail from "@/components/DataInsights/InsightCardDetails";
import type { OverviewSpec } from "@/types/insightSpec";

interface PassiveSensingTabProps {
  showOverviewCardData?: boolean;
  overviewCardData?: OverviewSpec;
  passiveSensingFacts: InsightExpandViewItem[];
}

const PassiveSensingTab: React.FC<PassiveSensingTabProps> = ({
                                                                 showOverviewCardData=true,
                                                                   overviewCardData,
                                                                 passiveSensingFacts,
                                                               }) => {
    const deduplicatedFacts = Array.from(
        new Map(passiveSensingFacts.map(fact => [fact.summarySentence, fact])).values()
    );

    return (
      <div className="flex gap-4 h-full py-2 px-4">
        {showOverviewCardData && overviewCardData && (
          <div className="w-[240px] shrink-0 h-full sticky top-0 z-10">
            <OverviewSummary overviewCardData={overviewCardData} />
          </div>
        )}

        <div className="flex-1 h-full flex flex-col bg-gray-50 border rounded-xl shadow">
          <div className="p-4 border-b">
            {showOverviewCardData && (
              <h2 className="text-lg font-semibold">Passive Sensing Data</h2>
            )}
            <p className="mt-2 text-sm text-muted-foreground">
              Visualization of passive data goes here.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <InsightCardDetail
              insightCardDataExpandView={deduplicatedFacts}
              isBaseline={true}
            />
          </div>
        </div>
      </div>
    );
};


export default PassiveSensingTab;
