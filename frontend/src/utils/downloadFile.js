// Forces a real download instead of the browser's default cross-origin
// behavior (open/view inline) - `<a download>` alone is ignored by
// browsers once href is cross-origin (our API and the Vite dev server
// run on different origins), so the file has to be fetched as a blob
// first and downloaded from a same-origin blob: URL. Same technique
// already used by fleetUnitsService.js/customerMasterService.js's own
// xlsx export downloads, generalized here for any file (media, etc.)
// rather than duplicated a fourth time.
export async function downloadFileFromUrl(url, fileName){

    // no-store: a plain <img>/<video> load of this same URL earlier
    // (e.g. the thumbnail this download button sits on) caches an
    // opaque no-cors response - a later default-mode fetch() can reuse
    // that cache entry and fail CORS validation ("No
    // 'Access-Control-Allow-Origin' header is present") even though
    // the server genuinely sends one on a fresh request. Bypassing the
    // cache avoids hitting that stale opaque entry.
    const response = await fetch(url, {cache: "no-store"});

    if(!response.ok){
        throw new Error(`Unable to download ${fileName}.`);
    }

    const blob = await response.blob();
    const objectUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(objectUrl);

}
