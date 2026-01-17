import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./src/pages/HomePage";
import BaselinePage from "./src/pages/BaselinePage";
import DevPage from "./src/pages/DevPage";
import PubPage from "@/pages/PubPage";

export default function App() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<PubPage />} />
          <Route path="/mind" element={<HomePage />} />
          <Route path="/fact" element={<BaselinePage />} />
          <Route path="/mind/:patientId" element={<HomePage />} />
          <Route path="/fact/:patientId" element={<BaselinePage />} />
          <Route path="/test" element={<DevPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    );
}
