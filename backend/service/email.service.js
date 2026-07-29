import nodemailer from "nodemailer";
import config from "../src/config/config.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: config.GOOGLE_EMAIL_USER,
    clientId: config.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: config.GOOGLE_OAUTH_CLIENT_SECRET,
    refreshToken: config.GOOGLE_EMAIL_REFRESH_TOKEN,
  },
});

//verify
transporter.verify((error) => {
  if (error) {
    console.log("Error connecting to mail service: ", error);
  } else {
    console.log("ready to send mail..");
  }
});

//sending email
const sendEmail = async function (from, to, subject, text, html) {
  try {
  const info = await transporter.sendMail({
    from: from, // sender address
    to: to, // list of recipients
    subject: subject, // subject line
    text: text, // plain text body
    html: html, // HTML body
  });

  console.log("Message sent: %s", info.messageId);
  // Preview URL is only available when using an Ethereal test account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
} catch (err) {
  throw err;
}
};



export default sendEmail;