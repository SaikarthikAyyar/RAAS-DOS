// ====================================
// API
// ====================================

const API = import.meta.env.VITE_API_URL;


// ====================================
// GET ALL USERS
// ====================================

export async function getUsers(){

    console.log(

        "\n========== ADMINISTRATION USERS =========="

    );

    const response = await fetch(

        `${API}/administration/users`

    );

    const data = await response.json();

    console.log(

        data

    );

    console.log(

        "==========================================\n"

    );

    if(

        !response.ok

    ){

        throw data;

    }

    return data;

}


// ====================================
// GET SINGLE USER
// ====================================

export async function getUser(

    userId

){

    console.log(

        "\n========== GET USER =========="

    );

    console.log(

        "User ID:",

        userId

    );

    const response = await fetch(

        `${API}/administration/users/${userId}`

    );

    const data = await response.json();

    console.log(

        data

    );

    console.log(

        "==============================\n"

    );

    if(

        !response.ok

    ){

        throw data;

    }

    return data;

}


// ====================================
// CREATE USER
// ====================================

export async function createUser(

    payload

){

    console.log(

        "\n========== CREATE USER =========="

    );

    console.log(

        payload

    );

    const response = await fetch(

        `${API}/administration/users`,

        {

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify(

                payload

            )

        }

    );

    const data = await response.json();

    console.log(

        data

    );

    console.log(

        "=================================\n"

    );

    if(

        !response.ok

    ){

        throw data;

    }

    return data;

}


// ====================================
// UPDATE USER
// ====================================

export async function updateUser(

    userId,

    payload

){

    console.log(

        "\n========== UPDATE USER =========="

    );

    console.log(

        "User:",

        userId

    );

    console.log(

        payload

    );

    const response = await fetch(

        `${API}/administration/users/${userId}`,

        {

            method:"PUT",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify(

                payload

            )

        }

    );

    const data = await response.json();

    console.log(

        data

    );

    console.log(

        "=================================\n"

    );

    if(

        !response.ok

    ){

        throw data;

    }

    return data;

}


// ====================================
// DELETE USER
// ====================================

export async function deleteUser(

    userId

){

    console.log(

        "\n========== DELETE USER =========="

    );

    console.log(

        "User:",

        userId

    );

    const response = await fetch(

        `${API}/administration/users/${userId}`,

        {

            method:"DELETE"

        }

    );

    const data = await response.json();

    console.log(

        data

    );

    console.log(

        "=================================\n"

    );

    if(

        !response.ok

    ){

        throw data;

    }

    return data;

}