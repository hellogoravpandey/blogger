import sendEmail from "../service/email.service.js";
import config from "../src/config/config.js";
import crypto from "crypto";

export function generateOTP(length = 6) {
    const digits = "0123456789";
    let otp = "";

    for (let i = 0; i < length; i++) {
        const index = crypto.randomInt(0, digits.length);
        otp += digits[index];
    }

    return otp;
}


export async function sendOtpVerificationEmail(to, otp) {
  const from = `${config.GOOGLE_EMAIL_USER}`;
  const subject = "OTP verification ";
  const text = `hi, we are ${config.GOOGLE_EMAIL_USER}`;
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Verification</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 0;">
    <tr>
      <td align="center">

        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td align="center" style="background:#2563eb;padding:30px;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;">
                Blogify
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:40px 35px;">

              <h2 style="margin-top:0;color:#333333;">
                Verify Your Email
              </h2>

              <p style="color:#555555;font-size:16px;line-height:1.6;">
                Hi <strong>${to}</strong>,
              </p>

              <p style="color:#555555;font-size:16px;line-height:1.6;">
                Thank you for registering with <strong>Blogify</strong>.
                Please use the following One-Time Password (OTP) to verify your email address.
              </p>

              <!-- OTP Box -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:30px 0;">
                    <div style="
                      display:inline-block;
                      background:#f3f4f6;
                      border:2px dashed #2563eb;
                      border-radius:8px;
                      padding:18px 40px;
                      font-size:34px;
                      font-weight:bold;
                      letter-spacing:8px;
                      color:#2563eb;">
                      ${otp}
                    </div>
                  </td>
                </tr>
              </table>

              <p style="color:#555555;font-size:16px;">
                This OTP will expire in
                <strong>10 minutes</strong>.
              </p>

              <p style="color:#555555;font-size:16px;line-height:1.6;">
                If you didn't create this account, you can safely ignore this email.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="
              background:#fafafa;
              padding:25px;
              text-align:center;
              border-top:1px solid #eeeeee;">

              <p style="margin:0;color:#888888;font-size:13px;">
                © 2026 Blogify. All rights reserved.
              </p>

              <p style="margin-top:8px;color:#999999;font-size:12px;">
                This is an automated email. Please do not reply.
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
 try {
    await sendEmail(config.GOOGLE_EMAIL_USER, to, subject, text, html);
 } catch (error) {
    throw error;
 } 
}
