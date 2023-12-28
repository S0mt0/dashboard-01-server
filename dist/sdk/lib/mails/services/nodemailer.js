"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNodemailer = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
/**
 * Sends emails using nodemailer service and gmail as mail service
 * @function
 * @param payload {SendMailOptions}
 * @returns
 */
const sendNodemailer = async (payload) => {
    const { from, html, text, subject, attachments, to } = payload;
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GOOGLE_AUTH_USER,
            pass: process.env.GOOGLE_AUTH_PASSWORD,
        },
    });
    const mailOptions = {
        from: from || "'Afrolay' <noreply.backoffice.server@gmail.com>",
        to,
        subject,
        html,
        text,
        attachments,
    };
    return await transporter.sendMail(mailOptions);
};
exports.sendNodemailer = sendNodemailer;
//# sourceMappingURL=nodemailer.js.map