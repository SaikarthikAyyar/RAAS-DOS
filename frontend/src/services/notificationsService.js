// ====================================
// API
// ====================================

const API = import.meta.env.VITE_API_URL;


// ====================================
// LIST NOTIFICATIONS (Audit Trail table)
// ====================================

export async function getNotifications({ dateFrom, dateTo, userId } = {}){

    const params = new URLSearchParams();

    if(dateFrom) params.set("date_from", dateFrom);
    if(dateTo) params.set("date_to", dateTo);
    if(userId) params.set("user_id", userId);

    const response = await fetch(`${API}/notifications?${params.toString()}`);

    const data = await response.json();

    if(!response.ok) throw data;

    return data;

}


// ====================================
// UNREAD NOTIFICATIONS (bell icon)
// ====================================

export async function getUnreadNotifications(userId, { dateFrom, dateTo } = {}){

    const params = new URLSearchParams({ user_id: userId });

    if(dateFrom) params.set("date_from", dateFrom);
    if(dateTo) params.set("date_to", dateTo);

    const response = await fetch(`${API}/notifications/unread?${params.toString()}`);

    const data = await response.json();

    if(!response.ok) throw data;

    return data;

}


// ====================================
// MARK ALL READ (per-user, fired on Audit Trail mount)
// ====================================

export async function markAllNotificationsRead(userId){

    const response = await fetch(`${API}/notifications/mark-all-read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId })
    });

    const data = await response.json();

    if(!response.ok) throw data;

    return data;

}


// ====================================
// EXPORT DATA (grouped by case, for the client-side .xlsx build)
// ====================================

export async function getNotificationsExport({ dateFrom, dateTo } = {}){

    const params = new URLSearchParams();

    if(dateFrom) params.set("date_from", dateFrom);
    if(dateTo) params.set("date_to", dateTo);

    const response = await fetch(`${API}/notifications/export?${params.toString()}`);

    const data = await response.json();

    if(!response.ok) throw data;

    return data;

}
