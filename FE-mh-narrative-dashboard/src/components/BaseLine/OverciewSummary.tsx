import type { OverviewSpec } from "@/types/insightSpec";
import { capitalizeFirst } from "@/utils/helper";

interface OverviewSummaryProps {
  overviewCardData: OverviewSpec;
}

const OverviewSummary: React.FC<OverviewSummaryProps> = ({
  overviewCardData,
}) => {
  return (
    <div className="bg-white shadow-sm rounded-xl px-3 py-2 border border-gray-200 flex flex-col">
      <h3 className="text-base font-semibold mb-2">Patient Summary</h3>
      <div className="space-y-1">
        {Object.entries(overviewCardData.basicInfoCard).map(([key, value]) => (
          <div key={key} className="flex flex-wrap text-sm text-gray-700">
            <span className="font-semibold text-gray-900 mr-1">
              {capitalizeFirst(key)}:
            </span>
            <span>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverviewSummary;
