import OverviewCardComponent from "@/components/Overview/OverviewCardComponent";
import { Activity, Brain, Heart } from "lucide-react";

interface OverviewComponentProps {
  isExpanded: boolean;
  isDrillDown: boolean;
}
export default function OverviewComponent({
                                            isExpanded,
                                            isDrillDown,
                                          }: OverviewComponentProps) {
  return (
      <div className="transition-all duration-300">
            <div
                className={`flex gap-4 mx-auto items-stretch ${
                    isDrillDown ? "flex-col" : "flex-col sm:flex-row"
                }`}
            >
              <div className={isDrillDown ? "w-full" : "sm:w-1/4"}>
                <div className="h-full bg-white shadow-sm rounded-xl p-4 border border-gray-200 flex flex-col">
                  <h3 className="text-lg font-semibold mb-2">Overview Summary</h3>
                  <p className="text-sm text-gray-600">
                    This section contains a brief summary of key patient metrics or
                    clinician notes.
                  </p>
                </div>
              </div>

                    <div className={`flex flex-col gap-4 ${isDrillDown ? "w-full" : "sm:w-3/4"}`}>
                        <OverviewCardComponent icon={Activity} title="Physical Activity" isExpanded={isExpanded}>
                            Patient is maintaining regular walking routines, averaging 8,000
                            steps daily.
                        </OverviewCardComponent>

                        <OverviewCardComponent icon={Brain} title="Cognitive Status" isExpanded={isExpanded}>
                            Noted improvement in memory recall and sustained attention over
                            recent weeks.
                        </OverviewCardComponent>

                        <OverviewCardComponent icon={Heart} title="Mood & Emotion" isExpanded={isExpanded}>
                            Patient reports stable mood with occasional anxiety in social
                            situations.
                        </OverviewCardComponent>
                    </div>

            </div>
      </div>
  );
}
