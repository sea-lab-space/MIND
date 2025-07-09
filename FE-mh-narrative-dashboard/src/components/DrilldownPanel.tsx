import { useState } from "react";
import {
  FileText,
  ClipboardList,
  BarChart3,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import DataSourceIcon from "./DatasourceIcon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { DatasourceIconType } from "@/types/props";
import { DatasourceIconTypes } from "@/types/props";

interface DrilldownPanelProps {
  onClose: () => void;
}

const DrilldownPanel: React.FC<DrilldownPanelProps> = (props) => {
  const { onClose } = props;

  const dataSources = Object.values(DatasourceIconTypes).slice(0, 3);

  const [linkViewsEnabled, setLinkViewsEnabled] = useState(true)

  // Sample data for the main chart
  const chartData = [
    { value: 0.8, type: "history" },
    { value: 1.2, type: "history" },
    { value: 1.5, type: "history" },
    { value: 0.9, type: "history" },
    { value: 1.1, type: "history" },
    { value: 1.3, type: "history" },
    { value: 1.8, type: "history" },
    { value: 2.1, type: "retrospective" },
    { value: 2.8, type: "retrospective" },
    { value: 3.2, type: "retrospective" },
    { value: 2.9, type: "retrospective" },
    { value: 3.5, type: "retrospective" },
    { value: 3.8, type: "retrospective" },
    { value: 4.2, type: "retrospective" },
    { value: 3.9, type: "retrospective" },
    { value: 4.1, type: "retrospective" },
  ]

  const maxValue = Math.max(...chartData.map((d) => d.value))

  return (
    <div className="flex-1">
      <div className="absolute z-10 items-center justify-center bottom-1/2 top-1/2">
        <Button
          variant="secondary"
          size="icon"
          className="full bg-white shadow-md transition-all hover:bg-gray-100 hover:shadow-lg w-5 h-20 rounded-none rounded-tr-md rounded-br-md"
          onClick={onClose}
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
      <div className="bg-[#f5f5f5] p-8 w-full">
        <div className="w-full max-w-[1800px] mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-[#1e1e1e]">
                Increased social activity, yet remains in a closed circle
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-[#757575]">Link Views</div>
                <div className="text-sm text-[#757575]">
                  Selected: June 10, 2025
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLinkViewsEnabled(!linkViewsEnabled)}
                className="p-2"
              >
                <div
                  className={`w-12 h-6 rounded-full transition-colors ${
                    linkViewsEnabled ? "bg-[#1e1e1e]" : "bg-[#d9d9d9]"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform mt-0.5 ${
                      linkViewsEnabled ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </div>
              </Button>
            </div>
          </div>
          {/* Sources */}
          <div className="flex items-center gap-4 text-sm text-[#757575]">
            <span>Sources:</span>
            {dataSources.map((ds) => (
              <DataSourceIcon showType iconType={ds as DatasourceIconType} />
            )
            )  
            }
          </div>
          {/* Passive Sensing Data Section */}
          <Card className="bg-white border-[#eaeaea]">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#626681]" />
                <span className="text-[#757575] font-medium">
                  Passive Sensing Data
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-6">
                {/* Left side - Text boxes */}
                <div className="flex-shrink-0 space-y-4 w-80">
                  <div className="border border-[#d9d9d9] rounded-lg p-4 bg-[#f7f5f5]">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#757575] mt-2" />
                      <div className="text-sm text-[#1e1e1e]">
                        <strong>Outbound phone communication</strong> increased
                        to 4-5 calls/texts daily
                      </div>
                    </div>
                  </div>
                  <div className="border border-[#d9d9d9] rounded-lg p-4 bg-[#f7f5f5]">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#757575] mt-2" />
                      <div className="text-sm text-[#1e1e1e]">
                        <strong>Outings to Social Hubs</strong> remains similar
                        to before
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side - Chart */}
                <div className="flex-1">
                  <div className="relative h-64">
                    {/* Y-axis labels */}
                    <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-[#be123c] font-medium">
                      <span>4.68</span>
                      <span>1.25</span>
                    </div>

                    {/* Chart area */}
                    <div className="ml-12 h-full relative">
                      {/* Dotted reference lines */}
                      <div
                        className="absolute w-full border-t border-dashed border-[#be123c] opacity-50"
                        style={{ top: "20%" }}
                      />
                      <div
                        className="absolute w-full border-t border-dashed border-[#be123c] opacity-50"
                        style={{ top: "80%" }}
                      />

                      {/* Bars */}
                      <div className="flex items-end justify-between h-full pb-8">
                        {chartData.map((item, index) => (
                          <div
                            key={index}
                            className={`w-4 rounded-t ${
                              item.type === "history"
                                ? "bg-[#b2b2b2]"
                                : "bg-[#626681]"
                            }`}
                            style={{
                              height: `${(item.value / maxValue) * 80}%`,
                            }}
                          />
                        ))}
                      </div>

                      {/* X-axis labels */}
                      <div className="absolute bottom-0 w-full flex justify-between text-xs text-[#757575]">
                        <span>history</span>
                        <span>retrospective</span>
                        <span>Time</span>
                      </div>

                      {/* Y-axis label */}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-[#757575] origin-center">
                        calls/day
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Clinical Notes and Transcript */}
          <div className="grid grid-cols-2 gap-6">
            {/* Clinical Notes */}
            <Card className="bg-white border-[#eaeaea]">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-[#ffc100]" />
                  <span className="text-[#ffc100] font-medium">
                    Clinical Notes
                  </span>
                </div>
                <div className="text-xs text-[#757575]">
                  *Color hue indicate relevance
                </div>
                <div className="flex gap-1 mt-2">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 w-8 ${
                        i < 5 ? "bg-[#d9b238]" : "bg-[#9fb40f]"
                      }`}
                    />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div>
                    <strong className="text-[#1e1e1e]">SUBJECTIVE:</strong>
                    <p className="text-[#2c2c2c] mt-1">
                      Patient reports current social life is "still pretty
                      quiet," primarily limited to phone interactions with his
                      sister. He notes some improvement in initiating calls to
                      his sister, which is new behavior for him, stating it's a
                      "little nudge" to connect and helps him feel "less alone
                      right after." He continues to find seeing friends or going
                      out difficult, citing low energy and worry about
                      conversation ("What if I just sit there and don't have
                      anything to say?"). He acknowledges ignoring calls/texts
                      when extremely tired or ruminating. Work-related contact
                      remains particularly challenging; he avoids answering
                      calls from colleagues.
                    </p>
                  </div>
                  <div>
                    <strong className="text-[#1e1e1e]">OBJECTIVE:</strong>
                    <ul className="text-[#2c2c2c] mt-1 space-y-1">
                      <li>
                        • <strong>Behavior:</strong> Patient's affect remains
                        somewhat constricted, though he showed moments of
                        increased animation when discussing positive
                        interactions with his sister.
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transcript */}
            <Card className="bg-white border-[#eaeaea]">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#9fb40f]" />
                  <span className="text-[#9fb40f] font-medium">Transcript</span>
                </div>
                <div className="text-xs text-[#757575]">
                  *Color hue indicate relevance
                </div>
                <div className="flex gap-1 mt-2">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 w-8 ${
                        i < 3
                          ? "bg-[#4d7c0f]"
                          : i < 7
                          ? "bg-[#9fb40f]"
                          : "bg-[#d9b238]"
                      }`}
                    />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div>
                    <span className="text-[#757575]">...</span>
                  </div>
                  <div>
                    <strong className="text-[#1e1e1e]">
                      Patient (John Doe):
                    </strong>
                    <p className="text-[#2c2c2c] mt-1">
                      Honestly, it's still pretty quiet. I mostly just{" "}
                      <span className="bg-[#9fb40f] text-white px-1">
                        talk to my sister
                      </span>
                      . She calls me, or I'll text her back. Sometimes I even
                      call her first, which is new for me, so that feels like
                      something. Other than that, I don't really see friends or
                      go out much. I'm just not up for it. Sometimes, if I'm
                      really tired or just feeling overwhelmed, I'll ignore
                      everything - even my sister. And if it's someone from work
                      trying to get in touch, I just can't bring myself to
                      answer those calls yet.
                    </p>
                  </div>
                  <div>
                    <strong className="text-[#1e1e1e]">
                      Psychiatrist (Dr. R):
                    </strong>
                    <p className="text-[#2c2c2c] mt-1">
                      "Thanks for sharing that, it gives me a clear picture. You
                      mentioned calling your sister first sometimes, and that's
                      a new thing for you. Can you tell me a little more about
                      what that's like? What goes through your mind when that
                      first call?"
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Relevant Context */}
          <Card className="bg-white border-[#eaeaea]">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#fb923c]" />
                <span className="text-[#fb923c] font-medium">
                  Measurement Scales
                </span>
              </div>
              <div className="text-sm text-[#1e1e1e] font-medium mt-2">
                Relevant Context
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-6">
                {/* Left side - Scale labels */}
                <div className="flex-shrink-0 space-y-4 w-48">
                  <div className="border border-[#d9d9d9] rounded-lg p-3 bg-[#f7f5f5]">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#fb923c]" />
                      <span className="text-sm font-medium text-[#1e1e1e]">
                        PHQ-9
                      </span>
                    </div>
                  </div>
                  <div className="border border-[#d9d9d9] rounded-lg p-3 bg-[#f7f5f5]">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#fb923c]" />
                      <span className="text-sm font-medium text-[#1e1e1e]">
                        MADRS
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side - Chart */}
                <div className="flex-1">
                  <div className="relative h-48">
                    {/* Y-axis labels */}
                    <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-[#be123c] font-medium">
                      <span>PHQ-9</span>
                      <span>23</span>
                      <span>11</span>
                    </div>

                    {/* Quarter badges */}
                    <div className="absolute top-0 right-20 flex gap-2">
                      <Badge
                        variant="outline"
                        className="text-[#fb923c] border-[#fb923c]"
                      >
                        Q1
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-[#fb923c] border-[#fb923c]"
                      >
                        Q2
                      </Badge>
                    </div>

                    {/* Chart area */}
                    <div className="ml-12 h-full relative">
                      {/* Background area */}
                      <div className="absolute bottom-8 w-full h-16 bg-[#eaeaea] opacity-50 rounded" />

                      {/* Line chart */}
                      <svg className="absolute bottom-8 w-full h-32">
                        <polyline
                          fill="none"
                          stroke="#fb923c"
                          strokeWidth="2"
                          points="0,80 50,60 100,70 150,50 200,65 250,45 300,40 350,55 400,35 450,50"
                        />
                        {/* Data points */}
                        {[0, 50, 100, 150, 200, 250, 300, 350, 400, 450].map(
                          (x, i) => (
                            <circle
                              key={i}
                              cx={x}
                              cy={[80, 60, 70, 50, 65, 45, 40, 55, 35, 50][i]}
                              r="3"
                              fill="#fb923c"
                            />
                          )
                        )}
                      </svg>

                      {/* Vertical divider */}
                      <div className="absolute bottom-8 left-3/4 w-px h-32 border-l border-dashed border-[#757575]" />

                      {/* X-axis labels */}
                      <div className="absolute bottom-0 w-full flex justify-between text-xs text-[#757575]">
                        <span>history</span>
                        <span>retrospective</span>
                        <span>Time</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DrilldownPanel;
