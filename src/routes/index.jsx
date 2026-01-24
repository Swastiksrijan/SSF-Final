// src/routes/index.jsx
import { createFileRoute } from "@tanstack/react-router";

import Home from "../pages/Home";
import Getinvolved from "../components/GetInvolved";
import Aboutus from "../components/Aboutus";
import KeyFocus from "../pages/KeyFocus";
import Impactstories from "../components/ImpactStories";
import Team from "../pages/Team";
import Collabrations from "../pages/Collabrations";
import ProgressSection from "../pages/ProgressSection";
import Supportour from "../components/Supportour";
import FAQSection from "../pages/FAQSection";

export const Route = createFileRoute("/")({
  component: () => (
    <>
      <Home />
    </>
  ),
});
