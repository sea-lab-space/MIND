import Header from "@/components/header";
import { nameListMap, retrospectHorizon } from "@/data/data";
import { getVisualizerDataForPerson } from "@/utils/dataConversion";
import { useState } from "react";
import {
  Brush,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const DevPage = () => {
  const [selectedPatient, setSelectedPatient] = useState("Gabriella Lin");

  const {
    passive_data_raw,
  } = getVisualizerDataForPerson(selectedPatient);

  return (
    <div className="flex flex-col h-screen">
      <div className="sticky top-0 z-50 shadow-md mb-2">
        <Header
          isHomePage
          patientNames={Object.values(nameListMap)}
          userName={"test"}
          retrospectHorizon={retrospectHorizon}
          selectedPatient={selectedPatient}
          setSelectedPatient={setSelectedPatient}
          disabled={false}
        />
      </div>
      <div className="flex flex-col flex-1 w-1/3 gap-2 overflow-y-auto">
        {passive_data_raw.map((data, index) => {
          const visData = data.data;
          if (!visData) {
            console.log(visData);
            return null;
          }

          const metricKey =
            Object.keys(visData[0] || {}).find((k) => k !== "date") ?? "";

          return (
            <div
              key={`chart-${index}`}
              className="mt-2 bg-gray-50 border border-gray-200 rounded-lg min-h-48 pr-4 pt-2"
            >
              <ResponsiveContainer
                key={`chart-${index}`}
                width="100%"
                height="100%"
              >
                <LineChart
                  width={500}
                  height={300}
                  data={visData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey={metricKey}
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DevPage;