export default function QuotesHeader({ total }){

    return (

        <div className="quotes-header">

            <h1 className="quotes-header-title">

                Quotes

            </h1>

            <p className="quotes-header-subtitle">

                {total} quote{total===1 ? "" : "s"} on file across all enquiries.

            </p>

        </div>

    );

}
