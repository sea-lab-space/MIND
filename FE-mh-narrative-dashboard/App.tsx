import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./src/pages/HomePage";
import BaselinePage from "./src/pages/BaselinePage";
import DevPage from "@/pages/DevPage";

export default function App() {
    return (
      <Router>
        <Routes>
          {/* Default to home */}
          <Route path="/" element={<HomePage />} />
          <Route path="/fact" element={<BaselinePage />} />
          {/* User study routes */}
          <Route path="/mind/:patientId" element={<HomePage />} />
          <Route path="/fact/:patientId" element={<BaselinePage />} />
          {/* Test pages routes */}
          <Route path="/test" element={<DevPage />} />
          {/* Redirect unknown paths to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    );
}
