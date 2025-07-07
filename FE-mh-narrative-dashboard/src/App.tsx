import Header from "./components/header";

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

  return (
    <>
      <Header 
        patientNames={nameList}
        userName={userName}
      />
    </>
  );
}

export default App;
