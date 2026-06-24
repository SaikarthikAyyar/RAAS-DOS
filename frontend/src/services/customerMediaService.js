import {

API

}

from "../config/api";


export async function uploadMedia(

customerId,

uploads

){

const formData=

new FormData();


(

uploads.photos || []

)

.forEach(

file=>{

formData.append(

"photos",

file

);

}

);


(

uploads.videos || []

)

.forEach(

file=>{

formData.append(

"videos",

file

);

}

);


(

uploads.layouts || []

)

.forEach(

file=>{

formData.append(

"layouts",

file

);

}

);


const response=

await fetch(

`${API}/customer-request/${customerId}/media`,

{

method:"POST",

body:formData

}

);


return response.json();

}


export async function getMedia(customerId){

const response=

await fetch(

`${API}/customer-request/${customerId}/media`

)

return response.json()

}