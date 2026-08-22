// ====================================
// FORMAT API ERROR
// FastAPI sends error detail two different shapes depending on WHERE
// the request was rejected: a route/service raising HTTPException(...,
// detail="some string") produces a plain string, but a Pydantic schema
// validation failure (e.g. a required field missing/malformed) never
// reaches app code at all - FastAPI auto-generates its own 422 with
// detail as an ARRAY of {type, loc, msg, input} objects instead.
//
// Every "setError(err?.detail || fallback)" call site was written
// assuming the first shape only. Rendering an array/object directly as
// JSX text throws "Objects are not valid as a React child" - which,
// with no error boundary anywhere in this app, unmounts the ENTIRE
// React tree to a blank white screen instead of showing an inline
// error. This is the shared, safe coercion every one of those call
// sites should use instead.
// ====================================

export function formatApiError(err, fallback = "Something went wrong. Please try again."){

    const detail = err?.detail;

    if(typeof detail === "string" && detail.trim()){
        return detail;
    }

    if(Array.isArray(detail)){
        return detail.map(d=>d?.msg || JSON.stringify(d)).join("; ") || fallback;
    }

    if(err?.message){
        return err.message;
    }

    return fallback;

}
