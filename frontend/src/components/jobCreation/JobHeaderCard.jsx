// ====================================
// IMPORTS
// ====================================




// ====================================
// COMPONENT
// ====================================

export default function JobHeaderCard({

    header,

    quotes,

    selectedQuote,

    handleQuoteChange

}){






    // ====================================
    // VERIFICATION
    // ====================================

    console.log(

        "\n========== JOB HEADER =========="

    );

    console.log(

        header

    );



    console.log(

        "===============================\n"

    );


    // ====================================
    // RENDER
    // ====================================

    return(

        <div className="jobCard">

            <h2>

                Job Header

            </h2>

            <div className="jobHeaderGrid">

                {/* Quote */}

                <div className="jobField">

                    <label>

                        PO / Quote Reference

                    </label>

                    <select

                        value={

                            selectedQuote || ""

                        }

                        onChange={

                            event =>

                            handleQuoteChange(

                                Number(

                                    event.target.value

                                )

                            )

                        }

                    >

                        {

                            quotes?.map(

                                quote => (

                                    <option

                                        key={

                                            quote.quote_id

                                        }

                                        value={

                                            quote.quote_id

                                        }

                                    >

                                        {

                                            `${quote.quote_reference} | ${quote.customer}`

                                        }

                                    </option>

                                )

                            )

                        }

                    </select>

                </div>

                {/* Job */}

                <div className="jobField">

                    <label>

                        Generated Job ID

                    </label>

                    <input

                        value={

                            header?.job_id || ""

                        }

                        disabled

                        readOnly

                    />

                </div>

                {/* Customer */}

                <div className="jobField">

                    <label>

                        Customer / Site

                    </label>

                    <input

                        value={

                            header?.customer || ""

                        }

                        disabled

                        readOnly

                    />

                </div>

                {/* Planned Start */}

                <div className="jobField">

                    <label>

                        Planned Start

                    </label>

                    <input

                        type="date"

                        value={

                            header?.planned_start || ""

                        }

                        readOnly

                    />

                </div>

                {/* Planned Completion */}

                <div className="jobField">

                    <label>

                        Planned Completion

                    </label>

                    <input

                        value={

                            header?.planned_completion || ""

                        }

                        disabled

                        readOnly

                    />

                </div>

                {/* Customer Status */}

                <div className="jobField">

                    <label>

                        Customer Visible Status

                    </label>

                    <select

                        value={

                            header?.customer_status ||

                            "Scheduled"

                        }



                    >

                        <option>

                            Scheduled

                        </option>

                        <option>

                            Mobilising

                        </option>

                        <option>

                            Executing

                        </option>

                        <option>

                            Completed

                        </option>

                    </select>

                </div>

            </div>

        </div>

    );

}