// ====================================
// EXECUTION MEDIA GALLERY
// Photos/videos captured during Job Execution (Phase 2) - works the
// same way as the Sales Survey's own media upload/review (an upload
// box that saves immediately on pick, a selector list + preview pane
// below it), scoped to a real execution instead of a customer
// request. One shared component for both places this needs to show
// up: the staff-facing Execution tab (readOnly=false, upload box
// shown) and the Customer Portal's read-only mirror of Phase 2
// (readOnly=true, upload box never rendered at all - not just
// disabled, so a customer can never interact with this set, only
// view it).
// ====================================

import { useCallback, useEffect, useState } from "react";

import "./Execution.css";

import { useAuth } from "../../contexts/AuthContext";

import ComponentExplainerIcon from "../guide/ComponentExplainerIcon";

import {
    getExecutionMedia,
    uploadExecutionMedia,
    deleteExecutionMedia
} from "../../services/executionMediaService";


export default function ExecutionMediaGallery({

    executionId,

    readOnly = false

}){

    const { user } = useAuth();

    const [media, setMedia] = useState([]);
    const [selected, setSelected] = useState(null);
    const [uploading, setUploading] = useState(false);


    // ====================================
    // LOAD MEDIA
    // ====================================

    const loadMedia = useCallback(async()=>{

        try{

            const response = await getExecutionMedia(executionId);

            setMedia(response);

            setSelected(response.length ? response[0] : null);

        }

        catch(error){

            console.error(error);

        }

    }, [executionId]);

    useEffect(()=>{

        if(executionId){
            void loadMedia();
        }

    }, [executionId, loadMedia]);


    // ====================================
    // DELETE
    // ====================================

    async function handleDeleteMedia(event, item){

        event.stopPropagation();

        if(!window.confirm(`Remove ${item.file_name}? This cannot be undone.`)){
            return;
        }

        try{

            await deleteExecutionMedia(item.id);

            await loadMedia();

        }
        catch(err){

            console.error(err);
            alert("Unable to remove this file. Please try again.");

        }

    }


    // ====================================
    // UPLOAD
    // ====================================

    async function handleFilesPicked(event){

        const picked = Array.from(event.target.files);

        event.target.value = "";

        if(picked.length === 0){
            return;
        }

        const photos = picked.filter(file => file.type.startsWith("image"));
        const videos = picked.filter(file => file.type.startsWith("video"));

        setUploading(true);

        try{

            await uploadExecutionMedia(executionId, { photos, videos }, user?.name);

            await loadMedia();

        }

        catch(err){

            console.error(err);
            alert("Unable to upload media. Please try again.");

        }

        finally{

            setUploading(false);

        }

    }


    // ====================================
    // UI
    // ====================================

    return(

        <div className="execution-card" data-guide-id="phase2-media" style={{position:"relative"}}>

            <ComponentExplainerIcon tabId="execution" componentId="phase2-media" floating/>

            <h2 className="execution-section-title">
                Media
            </h2>

            {!readOnly && (

                <div style={{marginBottom:14}}>

                    <input
                        id="execution-media"
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        disabled={uploading}
                        style={{display:"none"}}
                        onChange={handleFilesPicked}
                    />

                    <label
                        htmlFor="execution-media"
                        className="media-upload-box"
                    >
                        {uploading ? "Uploading..." : "Upload photos/videos"}
                    </label>

                </div>

            )}

            <div className="media-container">

                <div className="media-selector">

                    {media.map(item=>(

                        <div key={item.id} style={{position:"relative"}}>

                            <button
                                type="button"
                                className={selected?.id === item.id ? "media-item active" : "media-item"}
                                onClick={()=>setSelected(item)}
                                style={readOnly ? undefined : {paddingRight:26}}
                            >
                                {item.media_type === "photo" ? "📷" : "🎥"}{" "}
                                {item.file_name}
                            </button>

                            {!readOnly && (
                                <button
                                    type="button"
                                    title="Remove"
                                    onClick={event=>handleDeleteMedia(event, item)}
                                    style={{
                                        position:"absolute",
                                        top:"50%",
                                        right:6,
                                        transform:"translateY(-50%)",
                                        border:"none",
                                        background:"transparent",
                                        color:"#991b1b",
                                        fontWeight:800,
                                        cursor:"pointer",
                                        fontSize:"13px",
                                        lineHeight:1
                                    }}
                                >
                                    ✕
                                </button>
                            )}

                        </div>

                    ))}

                </div>

                <div className="media-preview">

                    {selected && selected.media_type === "photo" && (

                        <img
                            src={`${import.meta.env.VITE_API_URL}${selected.url}`}
                            alt={selected.file_name}
                            className="preview-image"
                        />

                    )}

                    {selected && selected.media_type === "video" && (

                        <div className="video-wrapper">
                            <video
                                key={selected.id}
                                controls
                                preload="metadata"
                                playsInline
                                className="preview-video"
                                src={`${import.meta.env.VITE_API_URL}${encodeURI(selected.url)}`}
                            >
                                Your browser does not support video
                            </video>
                        </div>

                    )}

                    {!selected && (

                        <div className="media-empty">
                            No media uploaded
                        </div>

                    )}

                </div>

            </div>

        </div>

    );

}
