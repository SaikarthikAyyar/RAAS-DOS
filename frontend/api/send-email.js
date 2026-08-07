import nodemailer from "nodemailer";

// ====================================
// EMAIL RELAY
// Render's outbound network blocks raw SMTP ports (confirmed via
// [Errno 101] Network is unreachable connecting to smtp.gmail.com:587),
// so the backend can't send mail directly. This endpoint runs on
// Vercel instead and does the actual SMTP send over Gmail, reached by
// the backend over plain HTTPS - which isn't blocked.
//
// Guarded by a shared secret (not auth, just an open-relay guard) so
// this can't be used by anyone who finds the URL to spam through the
// Gmail account.
// ====================================

export default async function handler(req, res){

    if(req.method !== "POST"){
        res.status(405).json({ ok:false, error:"Method not allowed" });
        return;
    }

    const providedSecret = req.headers["x-relay-secret"];

    if(!providedSecret || providedSecret !== process.env.EMAIL_RELAY_SECRET){
        res.status(401).json({ ok:false, error:"Unauthorized" });
        return;
    }

    const { to, subject, text } = req.body || {};

    if(!to || !subject || !text){
        res.status(400).json({ ok:false, error:"to, subject, and text are required" });
        return;
    }

    try{

        const transporter = nodemailer.createTransport({
            host:"smtp.gmail.com",
            port:587,
            secure:false,
            auth:{
                user:process.env.SMTP_USERNAME,
                pass:process.env.SMTP_PASSWORD
            }
        });

        await transporter.sendMail({
            from:`${process.env.SMTP_FROM_NAME || "RAAS-DOS"} <${process.env.SMTP_USERNAME}>`,
            to,
            subject,
            text
        });

        res.status(200).json({ ok:true });

    }

    catch(error){

        console.error("[EmailRelay] Send failed:", error);

        res.status(502).json({ ok:false, error:String(error) });

    }

}
