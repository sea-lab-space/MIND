import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./src/pages/HomePage";
import BaselinePage from "./src/pages/BaselinePage";
import DevPage from "@/pages/DevPage";

export default function App() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/fact" element={<BaselinePage />} />
          <Route path="/mind/:patientId" element={<HomePage />} />
          <Route path="/fact/:patientId" element={<BaselinePage />} />
          <Route path="/test" element={<DevPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    );
}
