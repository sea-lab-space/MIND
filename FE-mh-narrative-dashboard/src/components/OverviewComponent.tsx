import OverviewCardComponent from "@/components/OverviewCardComponent";
import { Activity, Brain, Heart } from "lucide-react";

interface OverviewComponentProps {
  isExpanded: boolean;
}

export default function OverviewComponent({
  isExpanded,
}: OverviewComponentProps) {
  return (
    <div className="transition-all duration-300">
      {isExpanded && (
        <div className="flex flex-col sm:flex-row gap-4 mx-auto items-stretch">
          <div className="sm:w-1/4">
            <div className="h-full bg-white shadow-sm rounded-xl p-4 border border-gray-200 flex flex-col">
              <h3 className="text-lg font-semibold mb-2">Overview Summary</h3>
              <p className="text-sm text-gray-600">
                This section contains a brief summary of key patient metrics or
                clinician notes.
              </p>
            </div>
          </div>

          <div className="mx-auto sm:w-3/4 flex flex-col gap-4">
            <OverviewCardComponent icon={Activity} title="Physical Activity">
              Patient is maintaining regular walking routines, averaging 8,000
              steps daily.
            </OverviewCardComponent>

            <OverviewCardComponent icon={Brain} title="Cognitive Status">
              Noted improvement in memory recall and sustained attention over
              recent weeks.
            </OverviewCardComponent>

            <OverviewCardComponent icon={Heart} title="Mood & Emotion">
              Patient reports stable mood with occasional anxiety in social
              situations.
            </OverviewCardComponent>
          </div>
        </div>
      )}
    </div>
  );
}
