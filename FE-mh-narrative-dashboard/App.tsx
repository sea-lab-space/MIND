import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./src/pages/HomePage";
import BaselinePage from "./src/pages/BaselinePage";

export default function App() {
    return (
        <Router>
            <Routes>
                {/* Default to home */}
                <Route path="/" element={<HomePage />} />
                <Route path="/fact" element={<BaselinePage />} />
                {/* Redirect unknown paths to home */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}
