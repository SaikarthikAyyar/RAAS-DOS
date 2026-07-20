// ====================================
// LOGIN USER
// ====================================

const API = import.meta.env.VITE_API_URL;

export async function loginUser(

    email,

    password

){

    const response = await fetch(

        `${API}/login`,

        {

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                email,

                password

            })

        }

    );

    if(

        !response.ok

    ){

        const error = await response.json();

        throw new Error(

            error.detail

        );

    }

    return await response.json();

}