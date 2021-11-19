export function RESET_PASSWORD_TEMPLATE(
  resetCode: string,
  recipientMail: string
) {
  return `
{
 "sender": {
      "name": "Open Decision",
      "email": ${process.env.EMAIL_FROM_ADDRESS},
 },
 "to": [
      {
           "email": ${recipientMail},
      }
 ],

 "htmlContent": "<!DOCTYPE html> <html> <body> <h1>Reset your password</h1> <p>Please reset your password by clicking on the link below</p> <a href=${
   "https://" + process.env.HOST_URL + "/auth/reset-password?code=" + resetCode
 }>Reset Password</a></body> </html>",
 "textContent": "Please confirm your email address by clicking on the link ${
   "https://" + process.env.HOST_URL + "/auth/reset-password?code=" + resetCode
 }",
 "subject": "Password Reset",
 "replyTo": {
      "email": ${
        process.env.EMAIL_REPLY_TO_ADDRESS
          ? process.env.EMAIL_REPLY_TO_ADDRESS
          : process.env.EMAIL_FROM_ADDRESS
      },
      "name": "Open Decision"
 },
}
`;
}
