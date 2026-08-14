// ====================================
// API
// ====================================

const API = import.meta.env.VITE_API_URL;


export function quoteReleaseDownloadUrl(documentId){

    return `${API}/quote-release-documents/${documentId}/download`;

}


export async function getQuoteReleaseDocumentForQuote(quoteId){

    const response = await fetch(`${API}/quotes/${quoteId}/quote-release-document`);

    if(!response.ok){
        return null;
    }

    return response.json();

}
