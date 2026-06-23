export default function CustomerActions({

submit

}){

return(

<div className="survey-actions">


<button

className="survey-btn save-btn"

onClick={submit}

>

Submit Requirement

</button>


<button

className="survey-btn info-btn"

>

Save Draft

</button>


</div>

);

}