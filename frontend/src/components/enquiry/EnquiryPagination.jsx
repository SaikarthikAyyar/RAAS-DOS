// =========================================
// COMPONENT
// =========================================

export default function EnquiryPagination({

    page,

    pageSize,

    total,

    onPageChange

}){

    console.log(

        "[EnquiryPagination] Rendering"

    );

    const totalPages = Math.max(

        1,

        Math.ceil(

            total / pageSize

        )

    );

    return(

        <div className="enquiry-pagination">

            <button

                type="button"

                className="enquiry-pagination-button"

                disabled={

                    page===1

                }

                onClick={

                    ()=>onPageChange?.(

                        page-1

                    )

                }

            >

                ← Prev

            </button>

            <span

                className="enquiry-pagination-info"

            >

                Page {page} of {totalPages}

                {" · "}

                {total} records

            </span>

            <button

                type="button"

                className="enquiry-pagination-button"

                disabled={

                    page===totalPages

                }

                onClick={

                    ()=>onPageChange?.(

                        page+1

                    )

                }

            >

                Next →

            </button>

        </div>

    );

}