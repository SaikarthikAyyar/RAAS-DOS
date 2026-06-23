import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";

import CustomerRequest from "./pages/CustomerRequest/CustomerRequest";

import SalesSurvey from "./pages/SalesSurvey/SalesSurvey";

import OpsSelector from "./pages/OpsSelector";

import DewateringGate from "./pages/DewateringGate";

import TechnoCommercialQuote from "./pages/TechnoCommercialQuote";

import ApprovalBoard from "./pages/ApprovalBoard";

import JobCreation from "./pages/JobCreation";

import Allocation from "./pages/Allocation";

import Execution from "./pages/Execution";

import CustomerPortal from "./pages/CustomerPortal";

import Analytics from "./pages/Analytics";


function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<MainLayout />}>

          <Route index element={<Login />} />

          <Route path="dashboard" element={<Dashboard />} />

          <Route path="customer-request" element={<CustomerRequest />} />

          <Route path="sales-survey" element={<SalesSurvey />} />

          <Route path="ops-selector" element={<OpsSelector />} />

          <Route path="dewatering-gate" element={<DewateringGate />} />

          <Route path="quote" element={<TechnoCommercialQuote />} />

          <Route path="approval" element={<ApprovalBoard />} />

          <Route path="job-creation" element={<JobCreation />} />

          <Route path="allocation" element={<Allocation />} />

          <Route path="execution" element={<Execution />} />

          <Route path="customer-portal" element={<CustomerPortal />} />

          <Route path="analytics" element={<Analytics />} />

        </Route>

      </Routes>

    </BrowserRouter>

  );

}

export default App;