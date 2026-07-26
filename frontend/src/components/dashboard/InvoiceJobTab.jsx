import SalesSummary from "./SalesSummary";
import OpsSummary from "./OpsSummary";
import QuoteSummary from "./QuoteSummary";

export default function InvoiceJobTab({

    invoice

}){

    if(!invoice){

        return null;

    }

    return(

        <>

            <div className="dashboard-section">

                <SalesSummary

                    summary={

                        invoice.sales_summary

                    }

                />

            </div>

            <div className="dashboard-section">

                <OpsSummary

                    summary={

                        invoice.ops_summary

                    }

                />

            </div>

            <div className="dashboard-section">

                <QuoteSummary

                    summary={

                        invoice.quote_summary

                    }

                />

            </div>

            <div className="dashboard-section">

                <h2>

                    Job Summary

                </h2>

                <div className="invoice-grid">

                    <div className="invoice-grid-item">

                        <div className="invoice-label">

                            Job ID

                        </div>

                        <div className="invoice-value">

                            {invoice.job_creation_id}

                        </div>

                    </div>

                    <div className="invoice-grid-item">

                        <div className="invoice-label">

                            Invoice ID

                        </div>

                        <div className="invoice-value">

                            {invoice.id}

                        </div>

                    </div>

                    <div className="invoice-grid-item">

                        <div className="invoice-label">

                            Customer Request

                        </div>

                        <div className="invoice-value">

                            {invoice.customer_request_id}

                        </div>

                    </div>

                    <div className="invoice-grid-item">

                        <div className="invoice-label">

                            Sales Survey

                        </div>

                        <div className="invoice-value">

                            {invoice.sales_survey_id}

                        </div>

                    </div>

                    <div className="invoice-grid-item">

                        <div className="invoice-label">

                            Allocated Machine

                        </div>

                        <div className="invoice-value">

                            {

                                invoice.machine_name ??

                                "-"

                            }

                        </div>

                    </div>

                    <div className="invoice-grid-item">

                        <div className="invoice-label">

                            Machine Code

                        </div>

                        <div className="invoice-value">

                            {

                                invoice.machine_code ??

                                "-"

                            }

                        </div>

                    </div>

                    <div className="invoice-grid-item">

                        <div className="invoice-label">

                            Personnel Assigned

                        </div>

                        <div className="invoice-value">

                            {

                                invoice.personnel_json?.length ??

                                invoice.personnel_count ??

                                0

                            }

                        </div>

                    </div>

                    <div className="invoice-grid-item">

                        <div className="invoice-label">

                            Planned Start

                        </div>

                        <div className="invoice-value">

                            {

                                invoice.planned_start ??

                                "-"

                            }

                        </div>

                    </div>

                    <div className="invoice-grid-item">

                        <div className="invoice-label">

                            Estimated Completion

                        </div>

                        <div className="invoice-value">

                            {

                                invoice.estimated_completion ??

                                "-"

                            }

                        </div>

                    </div>

                </div>

            </div>

        </>

    );

}