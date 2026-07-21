export default function Section3_Uploads({



updateMedia

}){




return(

<div className="survey-card">

<div className="survey-header">

<h2>

3. Uploads

</h2>

<span>

Photos/videos/layouts

</span>

</div>


<div className="survey-grid">


<UploadBox

label="📷 Site photos"

type="photos"

updateMedia={updateMedia}

/>


<UploadBox

label="🎥 Site videos"

type="videos"

updateMedia={updateMedia}

/>


<UploadBox

label="📄 Drawing / layout"

type="layouts"

updateMedia={updateMedia}

/>


</div>

</div>

);

}


function UploadBox({

label,

type,

updateMedia

}){

return(

<div className="survey-field">

<input

id={type}

type="file"

multiple

style={{

display:"none"

}}

onChange={(e)=>{

const files=

Array.from(

e.target.files

);

console.log(

type,

files

);

updateMedia(

type,

files

);

}}

/>


<label

htmlFor={type}

className="media-upload-box"

>

{label}

</label>

</div>

);

}