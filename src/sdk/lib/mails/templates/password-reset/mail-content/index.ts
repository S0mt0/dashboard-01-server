import fs from "fs";
import path from "path";
import Handlebars from "handlebars";

import __ from "../styles";

type ResetMailPayload = {
  token?: string | number;
  username: string;
  platform: string;
};

/**
 * @function
 * @param token
 * @param username
 * @param platform
 * @returns html and text content for mail
 */

export default ({ token, username, platform }: ResetMailPayload) => {
  const timestamp = new Date().toLocaleTimeString();

  // Read template files for RESET PASSWORD mail
  const resetSourcePath = path.join(__dirname, "..", "templates", "reset.html");
  const resetTemplateSource = fs.readFileSync(resetSourcePath, "utf8");

  //   compile template
  const resetTemplate = Handlebars.compile(resetTemplateSource);
  const resetMailHtml = resetTemplate({
    username,
    token,
    platform,

    styles: __.resetStyles,
  });

  const resetMailText = `Dear ${username}, you requested to reset your password on ${platform}. Use the 6-digit token below to initiate a password reset.`;

  // Read template files for FEEDBACK mail
  const feedbackSourcePath = path.join(
    __dirname,
    "..",
    "templates",
    "feedback.html"
  );
  const feedbackTemplateSource = fs.readFileSync(feedbackSourcePath, "utf8");

  //   compile template
  const feedbackTemplate = Handlebars.compile(feedbackTemplateSource);
  const feedbackMailHtml = feedbackTemplate({
    username,
    timestamp,

    styles: __.feedbackStyles,
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
