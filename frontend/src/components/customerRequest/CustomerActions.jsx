export default function CustomerActions({

submit,

submitting,

isEditMode

}){

return(

<div className="survey-actions">


<button

className="survey-btn save-btn"

onClick={
    submit

}

disabled={submitting}

>

{
    submitting
        ? (isEditMode ? "Saving..." : "Submitting...")
        : (isEditMode ? "Save Changes" : "Submit Requirement")
}



</button>



<button

className="survey-btn info-btn"

>

Save Draft

</button>


</div>

);

}