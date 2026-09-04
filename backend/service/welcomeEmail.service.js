import resend from "../src/config/resendMail.config.js";

const sendMail = async (to, username)=>{

    try {
        const {data} =  await resend.emails.send({
        from: "onboarding@resend.dev",
        to: "pandeygorav321@gmail.com",
        subject: "hello world",
        html: "<p>congratulations</p>"
    });
    console.log("email send", data);
    } catch (error) {
        console.log("error inside sendMail", error);
        throw error;
    }
    
}
    

export default sendMail;