import fetch from "node-fetch";
import { RESET_PASSWORD_TEMPLATE } from "./templates/reset-password";

export async function sendMail(emailContent: string) {
  if (process.env.SENDINBLUE_API_KEY) {
    const response = await fetch("https://api.sendinblue.com/v3/smtp/email", {
      method: "post",
      body: JSON.stringify(emailContent),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key": process.env.SENDINBLUE_API_KEY,
      },
    });
    const data = await response.json();

    return data;
  } else {
    return Error("No API-Key defined");
  }
}

export async function sendPasswordResetMail(
  presetCode: string,
  recipientMail: string
) {
  const emailContent = RESET_PASSWORD_TEMPLATE(presetCode, recipientMail);
  return await sendMail(emailContent);
}
