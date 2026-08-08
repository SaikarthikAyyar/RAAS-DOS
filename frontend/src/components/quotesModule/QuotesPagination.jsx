export default function QuotesPagination({

    page,

    pageSize,

    total,

    onPageChange

}){

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return(

        <div className="quotes-pagination">

            <button

                type="button"

                className="quotes-pagination-button"

                disabled={page===1}

                onClick={()=>onPageChange?.(page-1)}

            >

                ← Prev

            </button>

            <span className="quotes-pagination-info">

                Page {page} of {totalPages} · {total} records

            </span>

            <button

                type="button"

                className="quotes-pagination-button"

                disabled={page===totalPages}

                onClick={()=>onPageChange?.(page+1)}

            >

                Next →

            </button>

        </div>

    );

}
