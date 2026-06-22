import React from "react";

import { createRoot } from "react-dom/client";

import "./index.css";

import "./styles/sales-survey-glass.css";

import App from "./App.jsx";

import { WorkflowProvider } from "./contexts/WorkflowContext";

createRoot(document.getElementById("root")).render(

<React.StrictMode>

<WorkflowProvider>

<App />

</WorkflowProvider>

</React.StrictMode>

);
