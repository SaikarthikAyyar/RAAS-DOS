import React from "react";

import { createRoot } from "react-dom/client";

import "./index.css";

import "./index.css";

import "./styles/main.css";

import App from "./App.jsx";


import "./styles/layout.css";

import { WorkflowProvider } from "./contexts/WorkflowContext";

import {

AuthProvider

}

from "./contexts/AuthContext";

createRoot(document.getElementById("root")).render(

<React.StrictMode>

<AuthProvider>

<WorkflowProvider>

<App />

</WorkflowProvider>

</AuthProvider>

</React.StrictMode>

);
