"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const handlebars_1 = __importDefault(require("handlebars"));
const styles_1 = __importDefault(require("../styles"));
/**
 * @function
 * @param token
 * @param username
 * @param platform
 * @returns html and text content for mail
 */
exports.default = ({ token, username, platform }) => {
    const timestamp = new Date().toLocaleTimeString();
    // Read template files for RESET PASSWORD mail
    const resetSourcePath = path_1.default.join(__dirname, "..", "templates", "reset.html");
    const resetTemplateSource = fs_1.default.readFileSync(resetSourcePath, "utf8");
    //   compile template
    const resetTemplate = handlebars_1.default.compile(resetTemplateSource);
    const resetMailHtml = resetTemplate({
        username,
        token,
        platform,
        styles: styles_1.default.resetStyles,
    });
    const resetMailText = `Dear ${username}, you requested to reset your password on ${platform}. Use the 6-digit token below to initiate a password reset.`;
    // Read template files for FEEDBACK mail
    const feedbackSourcePath = path_1.default.join(__dirname, "..", "templates", "feedback.html");
    const feedbackTemplateSource = fs_1.default.readFileSync(feedbackSourcePath, "utf8");
    //   compile template
    const feedbackTemplate = handlebars_1.default.compile(feedbackTemplateSource);
    const feedbackMailHtml = feedbackTemplate({
        username,
        timestamp,
        styles: styles_1.default.feedbackStyles,
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
//# sourceMappingURL=index.js.map