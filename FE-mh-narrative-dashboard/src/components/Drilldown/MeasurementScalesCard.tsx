import {useEffect, useState} from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {shouldShowChart} from "@/utils/helper";
import InsightGraph from "@/components/DataInsights/InsightGraph";
import type {InsightExpandViewItem} from "@/types/props";
import { SURVEY_COLOR } from "@/utils/colorHelper";

interface measurementScoreFactsProps {
    measurementScoreFacts: InsightExpandViewItem[];
}

const MeasurementScalesCard = ({measurementScoreFacts} :measurementScoreFactsProps) => {
const [selectedKey, setSelectedKey] = useState<string | null>(null);
const selectedInsight = measurementScoreFacts.find((fact) => fact.key === selectedKey);

useEffect(() => {
    if (measurementScoreFacts.length > 0 && !selectedKey) {
        setSelectedKey(measurementScoreFacts[0].key);
    }
}, [measurementScoreFacts]);

if (!selectedInsight) {
    return (
        <Card className="bg-white border-[#eaeaea]">
            <CardHeader className="pb-4">
                <span className="text-[#757575] font-medium">Passive Sensing Data</span>
            </CardHeader>
            <CardContent>
                <div className="text-gray-500 text-sm">Loading insight data...</div>
            </CardContent>
        </Card>
    );
}

const showChart = shouldShowChart(selectedInsight.dataSourceType, selectedInsight.dataPoints);
return (
  <Card className="bg-white border-[#eaeaea]">
    <CardHeader className="pb-4">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-[#fb923c]" />
        <span className="text-[#fb923c] font-medium">Measurement Scales</span>
      </div>
    </CardHeader>
    <CardContent>
      <div className="flex gap-6 min-h-[400px]">
        {/* Left Side: Button List */}
        <div className="flex-shrink-0 space-y-4 w-80">
          {measurementScoreFacts.map((insight) => (
            <Button
              key={insight.key}
              variant="outline"
              onClick={() => setSelectedKey(insight.key)}
              className={`w-full justify-start h-auto text-left whitespace-normal p-4 text-sm text-[#1e1e1e] border-[#d9d9d9] ${
                selectedKey === insight.key ? "bg-[#f7f5f5]" : "bg-white"
              }`}
            >
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-[#fb923c] rounded-full mt-2 flex-shrink-0" />
                <span>{insight.summarySentence}</span>
              </div>
            </Button>
          ))}
        </div>

        {/* Right Side: Chart */}
        <div className="flex items-center justify-center flex-1 ">
          <div className="w-full h-72">
            {showChart && selectedInsight && (
              <InsightGraph
                dataSourceType={selectedInsight.dataSourceType}
                highlightSpec={selectedInsight.highlightSpec}
                data={selectedInsight.dataPoints}
                color={SURVEY_COLOR}
                isSurvey={true}
              />
            )}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);
};
export default MeasurementScalesCard;
