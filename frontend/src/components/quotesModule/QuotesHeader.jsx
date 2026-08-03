export default function QuotesHeader({ total }){

    return (

        <div className="enquiry-header">

            <h1 className="enquiry-header-title">

                Quotes

            </h1>

            <p className="enquiry-header-subtitle">

                {total} quote{total===1 ? "" : "s"} on file across all enquiries.

            </p>

        </div>

    );

}
