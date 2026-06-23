const API="http://127.0.0.1:8000";


// ====================================
// UPLOAD MEDIA
// ====================================

export async function uploadMedia(

customerId,

uploads

){
console.log(customerId);

console.log(uploads);

const formData=

new FormData();


// ====================================
// PHOTOS
// ====================================

(uploads.photos || []).forEach(

file=>{

formData.append(

"photos",

file

);

}

);


// ====================================
// VIDEOS
// ====================================

(uploads.videos || []).forEach(

file=>{

formData.append(

"videos",

file

);

}

);


// ====================================
// LAYOUTS
// ====================================

(uploads.layouts || []).forEach(

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


// ====================================
// GET MEDIA
// ====================================

export async function getCustomerMedia(

customerId

){

const response=

await fetch(

`${API}/customer-request/${customerId}/media`

);

return response.json();

}