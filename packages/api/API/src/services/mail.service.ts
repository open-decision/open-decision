import { logger } from "../config/logger";
import nodemailer from "nodemailer";
import config from "../config/config";

const transporter = nodemailer.createTransport({
  host: config.SMTP_HOST,
  port: config.PORT,
  secure: config.PORT == 465 ? true : false, // true for 465, false for other ports
  auth: {
    user: config.SMTP_USERNAME,
    pass: config.SMTP_PASSWORD,
  },
});

if (config.NODE_ENV !== "test") {
  transporter
    .verify()
    .then(() => logger.info("Connected to email server"))
    .catch(() =>
      logger.warn(
        "Unable to connect to email server. Make sure you have configured the SMTP options in .env"
      )
    );
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */

const sendEmail = async (to: string, subject: string, text: string) => {
  const msg = {
    from: config.EMAIL_FROM_ADDRESS,
    replyTo: config.EMAIL_REPLY_TO_ADDRESS
      ? config.EMAIL_REPLY_TO_ADDRESS
      : config.EMAIL_FROM_ADDRESS,
    to,
    subject,
    text,
  };
  await transporter.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */

const sendResetPasswordEmail = async (to: string, resetToken: string) => {
  const subject = "Reset password";
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `https://${config.HOST}/auth/reset-password?token=${resetToken}`;
  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */

const sendVerificationEmail = async (to: string, token: string) => {
  const subject = "Email Verification";
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `https://${config.HOST}/verify-email?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};

export const emailService = {
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
};
