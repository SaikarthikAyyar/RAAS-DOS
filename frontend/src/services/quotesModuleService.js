// ====================================
// API
// ====================================

const API = import.meta.env.VITE_API_URL;


// ====================================
// GET QUOTES LIST
// ====================================

export async function getQuotesList({

    status = null,

    search = "",

    page = 1,

    pageSize = 20

} = {}){

    const query = new URLSearchParams();

    if(status){
        query.append("status", status);
    }

    if(search){
        query.append("search", search);
    }

    query.append("page", page);

    query.append("page_size", pageSize);

    const response = await fetch(

        `${API}/quotes?${query.toString()}`

    );

    const data = await response.json();

    if(!response.ok){
        throw data;
    }

    return data;

}
