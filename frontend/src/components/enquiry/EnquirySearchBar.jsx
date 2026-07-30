export default function EnquirySearchBar({

    searchText,

    onSearchChange

}) {

    console.log(

        "[EnquirySearchBar] Component Loaded"

    );

    return (

        <div className="enquiry-search-bar">

            <input

                type="text"

                className="enquiry-search-input"

                placeholder="Search by ID, customer or owner..."

                value={searchText ?? ""}

                onChange={

                    (

                        event

                    ) =>

                        onSearchChange?.(

                            event.target.value

                        )

                }

            />

        </div>

    );

}