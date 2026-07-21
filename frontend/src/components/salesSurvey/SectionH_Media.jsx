// ====================================
// IMPORTS
// ====================================

import {

useEffect,

useState,

useCallback

}

from "react";

import {

getMedia

}

from "../../services/customerMediaService";


// ====================================
// COMPONENT
// ====================================

export default function SectionH_Media({

customerRequestId

}){


const [

media,

setMedia

]

=

useState(

[]

);


const [

selected,

setSelected

]

=

useState(

null

);


// ====================================
// LOAD MEDIA
// ====================================



const loadMedia = useCallback(async()=>{

    try{

        const response = await getMedia(customerRequestId);

        setMedia(response);

        if(response.length){

            setSelected(response[0]);

        }

        else{

            setSelected(null);

        }

    }

    catch(error){

        console.log(error);

    }

},[
    customerRequestId
]);

// ====================================
// LOAD MEDIA
// ====================================

useEffect(()=>{

    if(customerRequestId){

        void loadMedia();

    }

},[
    loadMedia
]);


// ====================================
// UI
// ====================================

return(

<div className="survey-card">


<div className="survey-header">

<h2>

H. Media Review

</h2>

<span>

Customer Request Uploads

</span>

</div>


{

!customerRequestId

?

<div className="media-empty">

Select a customer first

</div>

:

<div className="media-container">


<div className="media-selector">

{

media.map(

item=>(

<button

key={item.id}

className={

selected?.id===item.id

?

"media-item active"

:

"media-item"

}

onClick={()=>

setSelected(

item

)

}

>

{

item.media_type==="photo"

?

"📷"

:

"🎥"

}

{" "}

{item.file_name}

</button>

)

)

}

</div>


<div className="media-preview">


{

selected

&&

selected.media_type==="photo"

&&

<img

src={

`https://raas-dos.onrender.com${selected.url}`

}

alt={

selected.file_name

}

className="preview-image"

/>

}


{

selected

&&

selected.media_type==="video"

&&

<div className="video-wrapper">

<video

key={selected.id}

controls

preload="metadata"

playsInline

className="preview-video"

src={

`https://raas-dos.onrender.com${encodeURI(selected.url)}`

}

>

Your browser does not support video

</video>

</div>

}

{

!selected

&&

<div className="media-empty">

No media uploaded

</div>

}


</div>


</div>

}


</div>

)

}
