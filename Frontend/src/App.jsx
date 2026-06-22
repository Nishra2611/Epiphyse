import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import AboutTeam from "@/pages/AboutTeam";
import Home from "@/pages/Home";
import Predict from "@/pages/Predict";
import TechStack from "@/pages/TechStack";
import WhyPredict from "@/pages/WhyPredict";
import Workflow from "@/pages/Workflow";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/why-predict" element={<WhyPredict />} />
        <Route path="/predict" element={<Predict />} />
        <Route path="/workflow" element={<Workflow />} />
        <Route path="/tech" element={<TechStack />} />
        <Route path="/about" element={<AboutTeam />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
