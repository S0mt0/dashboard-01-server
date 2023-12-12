import nodemailer from "nodemailer";
import { MailOptions } from "../../../../../types";

/**
 * Sends emails using nodemailer service and gmail as mail service
 * @function
 * @param payload {SendMailOptions}
 * @returns
 */
export const sendNodemailer = async (payload: MailOptions) => {
  const { from, html, text, subject, attachments, to } = payload;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GOOGLE_AUTH_USER,
      pass: process.env.GOOGLE_AUTH_PASSWORD,
    },
  });

  const mailOptions = {
    from: from || "'Help Desk' <noreply.backoffice.server@gmail.com>",
    to,
    subject,
    html,
    text,
    attachments,
  };

  return await transporter.sendMail(mailOptions);
};
