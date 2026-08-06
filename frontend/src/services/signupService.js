// ====================================
// SIGNUP
// ====================================

const API = import.meta.env.VITE_API_URL;

// FastAPI returns `detail` as a plain string for a manually raised
// HTTPException, but as an array of {msg, ...} objects for a Pydantic
// field_validator failure (e.g. the @janyutech.com email check) -
// this normalizes either shape into one readable string.
function extractErrorMessage(error){

    const detail = error?.detail;

    if(typeof detail === "string"){
        return detail;
    }

    if(Array.isArray(detail)){
        return detail
            .map(item => item.msg)
            .filter(Boolean)
            .join(", ");
    }

    return "Something went wrong while creating the account. Please try again.";

}

export async function signupUser(

    name,

    email,

    password

){

    const response = await fetch(

        `${API}/signup`,

        {

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                name,

                email,

                password

            })

        }

    );

    const data = await response.json();

    if(

        !response.ok

    ){

        throw new Error(

            extractErrorMessage(data)

        );

    }

    return data;

}
