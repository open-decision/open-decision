import { logger } from "../config/logger";
import nodemailer from "nodemailer";
import { MailserverConfig } from "../validations/mailserver.validation";
import { APIError } from "@open-decision/type-classes";

export function createEmailService() {
  const parsedConfig = MailserverConfig.safeParse(process.env);

  if (!parsedConfig.success) return undefined;

  const { data: config } = parsedConfig;

  const transporter = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    secure: config.SMTP_PORT === 465 ? true : false, // true for 465, false for other ports
    auth: {
      user: config.SMTP_USERNAME,
      pass: config.SMTP_PASSWORD,
    },
  });

  transporter
    .verify()
    .then(() => {
      logger.info("Connected to email server");
    })
    .catch((error) => {
      console.log(error);
      logger.error(
        "Unable to connect to email server. Make sure you have configured the SMTP options in .env"
      );
    });

  const sendEmail = async (to: string, subject: string, text: string) => {
    try {
      await transporter.sendMail({
        from: config.EMAIL_FROM_ADDRESS,
        replyTo: config.EMAIL_REPLY_TO_ADDRESS
          ? config.EMAIL_REPLY_TO_ADDRESS
          : config.EMAIL_FROM_ADDRESS,
        to,
        subject,
        text,
      });
    } catch (error) {
      throw new APIError({
        code: "EMAIL_NOT_SEND",
        message: "The server was unable to send the email",
      });
    }
  };

  const sendResetPasswordEmail = async (to: string, resetToken: string) => {
    const subject = "Reset password";
    // replace this url with the link to the reset password page of your front-end app
    const resetPasswordUrl = `${config.OD_BUILDER_ENDPOINT}/auth/reset_password?token=${resetToken}`;
    const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
    await sendEmail(to, subject, text);
  };

  const sendVerificationEmail = async (to: string, token: string) => {
    const subject = "Email Verification";
    // replace this url with the link to the email verification page of your front-end app
    const verificationEmailUrl = `${config.OD_BUILDER_ENDPOINT}/api/verify-email?token=${token}`;
    const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
    return await sendEmail(to, subject, text);
  };

  return {
    sendEmail,
    sendResetPasswordEmail,
    sendVerificationEmail,
  };
}

export const emailService = createEmailService();
