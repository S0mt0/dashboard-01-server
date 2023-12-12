import fs from "fs";
import path from "path";
import Handlebars from "handlebars";

type ResetMailPayload = {
  token: string | number;
  username: string;
  platform: string;
};

const { FRONTEND_BASEURL } = process.env;

/**
 * @function
 * @param token
 * @param username
 * @param platform
 * @returns html and text content for mail
 */

export default ({ token, username, platform }: ResetMailPayload) => {
  const href = `${FRONTEND_BASEURL}/forgot-password?token=${token}`;
  const timestamp = new Date().toLocaleTimeString();

  // Read template files for RESET PASSWORD mail
  const resetSourcePath = path.join(__dirname, "..", "reset.html");
  const resetTemplateSource = fs.readFileSync(resetSourcePath, "utf8");

  //   compile template
  const resetTemplate = Handlebars.compile(resetTemplateSource);
  const resetMailHtml = resetTemplate({
    username,
    token,
    platform,
    href,

    styles: `
        <style>
        main{
            padding: 0 1rem;
        }

        header {
            background: #3f5bf6;
            height: 2.5rem;
        }

        p {
            color: #474747;
            margin-block: 1rem;
            line-height: 2;
        }

        p span {
            text-transform: capitalize;
            font-weight: 600;
        }

        h3 {
            color: #27282b;
            text-align: center;
            font-weight: 700;
            font-size: 1.7rem;
        }

        article {
           text-align: center;
           margin-top: 0.5rem;
           color: #bebebe;
        }
        </style>
    `,
  });

  const resetMailText = `Dear ${username}, you requested to reset your password on ${platform}. Use the 6-digit token below to initiate a password reset. Or, you can follow the link, ${href} to securely reset your password. Token is valid for 15 minutes.`;

  // Read template files for FEEDBACK mail
  const feedbackSourcePath = path.join(__dirname, "..", "feedback.html");
  const feedbackTemplateSource = fs.readFileSync(feedbackSourcePath, "utf8");

  //   compile template
  const feedbackTemplate = Handlebars.compile(feedbackTemplateSource);
  const feedbackMailHtml = feedbackTemplate({
    username,
    timestamp,

    styles: `
        <style>
        main{
            padding: 0 1rem;
        }

        header {
            background: #3f5bf6;
            height: 2.5rem;
        }

        p {
            color: #474747;
            margin-block: 1rem;
            line-height: 2;
        }

        article {
           text-align: center;
           margin-top: 0.5rem;
           color: #bebebe;
        }
        </style>
    `,
  });

  const feedbackMailText = `Dear ${username}, your password has been successfully updated. Timestamp: ${timestamp}`;

  return {
    resetMail: {
      html: resetMailHtml,
      text: resetMailText,
    },

    feedbackMail: {
      html: feedbackMailHtml,
      text: feedbackMailText,
    },
  };
};
