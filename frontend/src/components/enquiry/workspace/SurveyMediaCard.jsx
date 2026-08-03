import { useEffect, useState } from "react";

import { API } from "../../../config/api";

import {
    getMedia
} from "../../../services/customerMediaService";

export default function SurveyMediaCard({

    customerRequestId

}){

    const [media, setMedia] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(()=>{

        let cancelled = false;

        if(!customerRequestId){

            setLoading(false);

            return;

        }

        setLoading(true);

        getMedia(customerRequestId)
            .then(data=>{

                if(!cancelled){
                    setMedia(Array.isArray(data) ? data : []);
                }

            })
            .catch(err=>{

                console.error(err);

                if(!cancelled){
                    setMedia([]);
                }

            })
            .finally(()=>{

                if(!cancelled){
                    setLoading(false);
                }

            });

        return ()=>{ cancelled = true; };

    },[customerRequestId]);

    const photos = media.filter(item=>item.media_type==="photo");

    const videos = media.filter(item=>item.media_type==="video");

    const layouts = media.filter(item=>item.media_type==="layout");

    return(

        <div className="survey-summary-card">

            <h3 className="survey-summary-title">

                Media ({media.length})

            </h3>

            {

                loading ? (

                    <p className="survey-empty">Loading media...</p>

                ) : media.length===0 ? (

                    <p className="survey-empty">No media uploaded.</p>

                ) : (

                    <>

                        {

                            photos.length > 0 && (

                                <>

                                    <h4 className="ops-subheading">Photos ({photos.length})</h4>

                                    <div className="survey-media-grid">

                                        {

                                            photos.map(photo=>(

                                                <a

                                                    key={photo.id}

                                                    href={`${API}${photo.url}`}

                                                    target="_blank"

                                                    rel="noreferrer"

                                                    className="survey-media-thumb"

                                                    title={photo.file_name}

                                                >

                                                    <img

                                                        src={`${API}${photo.url}`}

                                                        alt={photo.file_name}

                                                    />

                                                </a>

                                            ))

                                        }

                                    </div>

                                </>

                            )

                        }

                        {

                            videos.length > 0 && (

                                <>

                                    <h4 className="ops-subheading">Videos ({videos.length})</h4>

                                    <ul className="survey-media-list">

                                        {

                                            videos.map(video=>(

                                                <li key={video.id}>

                                                    <a

                                                        href={`${API}${video.url}`}

                                                        target="_blank"

                                                        rel="noreferrer"

                                                    >

                                                        {video.file_name}

                                                    </a>

                                                </li>

                                            ))

                                        }

                                    </ul>

                                </>

                            )

                        }

                        {

                            layouts.length > 0 && (

                                <>

                                    <h4 className="ops-subheading">Layouts ({layouts.length})</h4>

                                    <ul className="survey-media-list">

                                        {

                                            layouts.map(layout=>(

                                                <li key={layout.id}>

                                                    <a

                                                        href={`${API}${layout.url}`}

                                                        target="_blank"

                                                        rel="noreferrer"

                                                    >

                                                        {layout.file_name}

                                                    </a>

                                                </li>

                                            ))

                                        }

                                    </ul>

                                </>

                            )

                        }

                    </>

                )

            }

        </div>

    );

}
