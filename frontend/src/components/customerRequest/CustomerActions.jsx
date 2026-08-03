export default function CustomerActions({

submit,

submitting

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

{submitting ? "Submitting..." : "Submit Requirement"}



</button>



<button

className="survey-btn info-btn"

>

Save Draft

</button>


</div>

);

}