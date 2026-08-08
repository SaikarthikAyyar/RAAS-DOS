export default function QuotesSearchBar({

    searchText,

    onSearchChange

}){

    return (

        <div className="quotes-search-bar">

            <input

                type="text"

                className="quotes-search-input"

                placeholder="Search by quote ID, enquiry ID or customer..."

                value={searchText ?? ""}

                onChange={event=>onSearchChange?.(event.target.value)}

            />

        </div>

    );

}
