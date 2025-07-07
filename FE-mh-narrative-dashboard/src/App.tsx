import Header from "./components/header";
import type { RetrospectOptions } from "./types/props";

function App() {
  const nameList = [
    "John Doe",
    "Jane Smith",
    "Mike Johnson",
    "Sarah Wilson",
    "David Brown",
    "Lisa Davis",
    "Tom Miller",
    "Emma Garcia",
    "Alex Martinez",
    "Olivia Taylor",
  ];

  const userName = "Ryan"

  const retrospectHorizon: RetrospectOptions = {
    "Since last encounter": 14,
    "Last month": 30,
    "Last 3 months": 90,
    "Last 6 months": 180,
    "Last year": 365,
  }

  return (
    <>
      <Header 
        patientNames={nameList}
        userName={userName}
        retrospectHorizon={retrospectHorizon}
      />
    </>
  );
}

export default App;
