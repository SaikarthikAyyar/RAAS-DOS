import React from "react";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/sales-survey-glass.css'  // ← add this
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)

import { WorkflowProvider }

from "./contexts/WorkflowContext";

createRoot(document.getElementById('root')).render(
<React.StrictMode>

<WorkflowProvider>

<App />

</WorkflowProvider>

</React.StrictMode>,
)
