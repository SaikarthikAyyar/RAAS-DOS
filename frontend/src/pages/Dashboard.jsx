// ====================================
// IMPORTS
// ====================================

import useDashboard from "../hooks/useDashboard";

import "../components/dashboard/Dashboard.css";

import DashboardStats from "../components/dashboard/DashboardStats";
import CustomerBrowser from "../components/dashboard/CustomerBrowser";
import CustomerSummary from "../components/dashboard/CustomerSummary";
import SurveyBrowser from "../components/dashboard/SurveyBrowser";
import SalesSummary from "../components/dashboard/SalesSummary";
import OpsSummary from "../components/dashboard/OpsSummary";


// ====================================
// PAGE
// ====================================

export default function Dashboard(){

    const {

        dashboard,

        customerNavigator,

        startCustomerId,
        setStartCustomerId,

        selectedCustomerId,
        setSelectedCustomerId,

        startSurveyId,
        setStartSurveyId,

        selectedSurveyId,
        setSelectedSurveyId,

        reloadDashboard

    } = useDashboard();

    return(

        <div className="dashboard-page">

            {/* ==================================== */}
            {/* PAGE TITLE */}
            {/* ==================================== */}

            <div className="dashboard-header">

                <h1>

                    RAAS Dashboard

                </h1>

                <p>

                    Workflow Monitoring & Consolidated Project Summary

                </p>

            </div>


            {/* ==================================== */}
            {/* STATISTICS */}
            {/* ==================================== */}

            <div className="dashboard-section">

                <h2>

                    Statistics

                </h2>

                <DashboardStats

                    stats={dashboard?.stats}

                />

            </div>


            {/* ==================================== */}
            {/* CUSTOMER REQUESTS */}
            {/* ==================================== */}

            <div className="dashboard-section">

                <h2>

                    Customer Requests

                </h2>

                <CustomerBrowser

                    customers={dashboard?.customers}

                    customerNavigator={dashboard?.customer_navigator}

                    selectedCustomerId={selectedCustomerId}

                    setSelectedCustomerId={setSelectedCustomerId}

                    startCustomerId={startCustomerId}

                    setStartCustomerId={setStartCustomerId}

                />

            </div>


            {/* ==================================== */}
            {/* CUSTOMER INFORMATION */}
            {/* ==================================== */}

            <div className="dashboard-section">

                <h2>

                    Customer Information

                </h2>

                <CustomerSummary

                    summary={

                        dashboard?.customer_summary

                    }

                />

            </div>


            {/* ==================================== */}
            {/* SALES SURVEYS */}
            {/* ==================================== */}

            <div className="dashboard-section">

                <h2>

                    Sales Surveys

                </h2>

                <SurveyBrowser

                    surveys={

                        dashboard?.visible_surveys

                    }

                    surveyNavigator={

                        dashboard?.survey_navigator

                    }

                    selectedSurveyId={

                        selectedSurveyId

                    }

                    setSelectedSurveyId={

                        setSelectedSurveyId

                    }

                    startSurveyId={

                        startSurveyId

                    }

                    setStartSurveyId={

                        setStartSurveyId

                    }

                />

            </div>


            {/* ==================================== */}
            {/* SALES SUMMARY */}
            {/* ==================================== */}

            <div className="dashboard-section">

                <h2>

                    Sales Survey Summary

                </h2>

                <SalesSummary

                    summary={

                        dashboard?.selected_summary

                    }

                />

            </div>


            {/* ==================================== */}
            {/* OPS SUMMARY */}
            {/* ==================================== */}

            <div className="dashboard-section">

                <h2>

                    Ops Selector Summary

                </h2>

                <OpsSummary

                    summary={

                        dashboard?.ops_summary

                    }

                />

            </div>


            {/* ==================================== */}
            {/* FUTURE MODULES */}
            {/* ==================================== */}

            <div className="dashboard-section">

                <h2>

                    Future Workflow

                </h2>

                <div className="dashboard-placeholder">

                    Quote, Approval, Job Sheet and Execution summaries will appear here.

                </div>

            </div>

        </div>

    );

}