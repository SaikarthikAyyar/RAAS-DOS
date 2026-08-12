// ====================================
// API
// ====================================

const API = import.meta.env.VITE_API_URL;


// ====================================
// SET (create/replace)
// ====================================

export async function setSurveyReminder(enquiryId, { thresholdSeconds, userId, userName }){

    const response = await fetch(

        `${API}/survey-reminders/${enquiryId}`,

        {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                threshold_seconds: thresholdSeconds,
                set_by_user_id: userId,
                set_by_name: userName
            })
        }

    );

    const data = await response.json();

    if(!response.ok){
        throw data;
    }

    return data;

}


// ====================================
// CANCEL
// ====================================

export async function cancelSurveyReminder(enquiryId){

    const response = await fetch(

        `${API}/survey-reminders/${enquiryId}`,

        {
            method:"DELETE"
        }

    );

    const data = await response.json();

    if(!response.ok){
        throw data;
    }

    return data;

}


// ====================================
// STATUS
// ====================================

export async function getSurveyReminderStatus(enquiryId){

    const response = await fetch(

        `${API}/survey-reminders/${enquiryId}`

    );

    const data = await response.json();

    if(!response.ok){
        throw data;
    }

    return data;

}
