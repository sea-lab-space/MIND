import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import InsightGraph from "@/components/DataInsights/InsightGraph";
import { shouldShowChart } from "@/utils/helper";
import type {InsightExpandViewItem} from "@/types/props";
import {Watch} from "lucide-react";
import DataSourceIcon from "../DatasourceIcon";

interface PassiveSensingCardProps {
    passiveSensingFacts: InsightExpandViewItem[];
}

const PassiveSensingCard = ({ passiveSensingFacts }: PassiveSensingCardProps) => {
    const [selectedKey, setSelectedKey] = useState<string | null>(null);
    const selectedInsight = passiveSensingFacts.find((fact) => fact.key === selectedKey);

    useEffect(() => {
        if (passiveSensingFacts.length > 0 && !selectedKey) {
            setSelectedKey(passiveSensingFacts[0].key);
        }
    }, [passiveSensingFacts]);

    if (!selectedInsight) {
        return (
          <Card className="bg-white border-[#eaeaea]">
            <CardHeader className="pb-4">
              <span className="text-[#757575] font-medium">Loading</span>
            </CardHeader>
            <CardContent>
              <div className="text-gray-500 text-sm">
                Loading insight data...
              </div>
            </CardContent>
          </Card>
        );
    }

    const showChart = shouldShowChart(selectedInsight.dataSourceType, selectedInsight.dataPoints);
    return (
      <Card className="bg-white border-[#eaeaea]">
        <CardHeader>
          <div className="flex items-center gap-2 font-medium">
            {/* <Watch className="w-4 h-4 text-[#626681]" />
                    <span className="text-[#757575] font-medium">Passive Sensing Data</span> */}
            <DataSourceIcon iconType="passive sensing" showType />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6 min-h-[400px]">
            {/* Left Side: Button List */}
            <div className="flex-shrink-0 space-y-4 w-80">
              {passiveSensingFacts.map((insight) => (
                <Button
                  key={insight.key}
                  variant="outline"
                  onClick={() => setSelectedKey(insight.key)}
                  className={`w-full justify-start h-auto text-left whitespace-normal p-4 text-sm text-[#1e1e1e] border-[#d9d9d9] ${
                    selectedKey === insight.key ? "bg-[#f7f5f5]" : "bg-white"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-gray-600 rounded-full mt-2 flex-shrink-0" />
                    <span>{insight.summarySentence}</span>
                  </div>
                </Button>
              ))}
            </div>

            {/* Right Side: Chart */}
            <div className="flex items-center justify-center flex-1">
              <div className="w-full h-72">
                {showChart && selectedInsight && (
                  <InsightGraph
                    dataSourceType={selectedInsight.dataSourceType}
                    highlightSpec={selectedInsight.highlightSpec}
                    data={selectedInsight.dataPoints}
                  />
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
};

export default PassiveSensingCard;
