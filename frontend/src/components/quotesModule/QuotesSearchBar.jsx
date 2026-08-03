export default function QuotesSearchBar({

    searchText,

    onSearchChange

}){

    return (

        <div className="enquiry-search-bar">

            <input

                type="text"

                className="enquiry-search-input"

                placeholder="Search by quote ID, enquiry ID or customer..."

                value={searchText ?? ""}

                onChange={event=>onSearchChange?.(event.target.value)}

            />

        </div>

    );

}
