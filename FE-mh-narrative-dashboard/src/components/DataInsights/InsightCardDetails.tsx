// InsightCardDetail.tsx
import {type InsightCardData} from "@/types/props";

export interface InsightCardDetailProps {
  insightCardData: InsightCardData;
}

export default function InsightCardDetail({
                                            insightCardData
                                          }: InsightCardDetailProps) {
  return (
    <div className="space-y-6 pt-0 text-sm">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-gray-600 rounded-full mt-2 flex-shrink-0"></div>
          <div>
            <span className="font-semibold text-gray-900">
              Social App Usage:
            </span>
            <span className="text-gray-700 ml-1">
              Daily active time increased by 30%.
            </span>
          </div>
        </div>
        <div className="ml-5 bg-gray-50 border border-gray-200 rounded-lg p-4 h-48 flex items-center justify-center">
          <div className="text-gray-500 text-sm">
            Chart visualization would go here
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-gray-600 rounded-full mt-2 flex-shrink-0"></div>
          <div>
            <span className="font-semibold text-gray-900">
              GPS Data (New Locations Visited per Week):
            </span>
            <span className="text-gray-700 ml-1">
              Average 1 new non-routine location/week
            </span>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-gray-600 rounded-full mt-2 flex-shrink-0"></div>
          <div>
            <span className="font-semibold text-gray-900">Patient Report:</span>
            <span className="text-gray-700 ml-1">
              Increased effort in communication, primarily with their sister.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
