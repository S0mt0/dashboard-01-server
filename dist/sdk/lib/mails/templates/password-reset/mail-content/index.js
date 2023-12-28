"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSuccessMail = exports.resetPasswordMailContent = void 0;
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
const resetPasswordMailContent = (payload) => {
    return {
        text: `Dear ${payload.username}, you requested to reset your password on Afrolay. Use the 6-digit token below to initiate a password reset.`,
        html: `<html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <style>
                *,
                * > * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                  color: #5a5858;
                }

                .container {
                  padding-inline: 1rem;
                }

                main {
                  width: 90%;
                  margin-inline: auto;
                  max-width: 620px;
                }

                header {
                  padding: 2rem;
                  text-align: center;
                  border-bottom: 1px solid #f7b946d7;
                }

                header img {
                  max-width: 120px;
                  display: inline;
                }

                .body {
                  padding: 2rem 1.1rem;
                }

                h1 {
                  font-size: 1rem;
                  margin-bottom: 1rem;
                  color: #000;
                }

                h3 {
                  margin-bottom: 1rem;
                  margin-top: 1rem;
                  color: #000;
                }

                .ps {
                  width: 80%;
                  margin: 1rem auto;
                  padding: 1rem;
                  text-align: center;
                }

                .ps small {
                  color: #b1b0b0;
                  font-size: 11px;
                  text-align: center;
                }

                @media screen and (min-width: 768px) {
                .body, 
                header, 
                main,
                .container {
                  background-color: #fff;
                  }

                header img {
                max-width: 150px;
                  }
                } 
              </style>
            </head>
            <body>
              <div class="container">
                <main>
                  <header>
                    <img
                      src="https://res.cloudinary.com/doszbexiw/image/upload/v1703759856/Afrolay/logo-01_cjdnpu.png"
                      alt="logo"
                    />
                  </header>
                  <div class="body">
                    <h1>Dear ${payload.username},</h1>
                    <p>
                      You requested to reset your password on
                      <strong>Afrolay&trade;.</strong> Use the 6-digit code below to
                      initiate a password reset.
                    </p>
                    <h3>${payload.otp}</h3>
                    <p>This code is valid for the next 15 minutes.</p>
                  </div>

                  <div class="ps">
                    <small
                      >This message was intended for ${payload.username}. If you did not request a
                      password reset from Afrolay&trade;, please ignore this email.</small
                    >
                  </div>
                </main>
              </div>
            </body>
          </html>`,
    };
};
exports.resetPasswordMailContent = resetPasswordMailContent;
const resetPasswordSuccessMail = (payload) => {
    return {
        text: `Dear ${payload.username}, your password has been successfully updated. Timestamp: ${payload.timestamp}`,
        html: `<html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style>
              *,
              * > * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                color: #5a5858;
              }

              .container {
                background: #f0efefc7;
                padding-inline: 1rem;
              }

              main {
                width: 90%;
                background: white;
                margin: 0 auto;
                max-width: 620px;
              }

              header {
                padding: 2rem;
                display: flex;
                justify-content: center;
                align-items: center;
                border-bottom: 1px solid #f7b946d7;
              }

              header img {
                width: 150px;
              }

              .body {
                padding: 2rem 1.1rem;
              }

              h1 {
                font-size: 1rem;
                margin-bottom: 1rem;
                color: #000;
              }

              .ps {
                text-align: center;
                width: 80%;
                margin: 1rem auto;
                padding: 1rem;
              }

              .ps small {
                color: #b1b0b0;
                line-height: 1.1;
                font-size: 11px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <main>
                <header>
                  <img
                    src="https://res.cloudinary.com/doszbexiw/image/upload/v1703759856/Afrolay/logo-01_cjdnpu.png"
                    alt="logo"
                  />
                </header>
                <div class="body">
                  <h1>Dear ${payload.username},</h1>
                  <p>
                    You have successfully updated your login password on
                    <strong>Afrolay&trade;.</strong>
                  </p>
                  <p>
                    To continue, you can securely <a href="https://afrolay.vercel.app/sign-in">login here.</a>
                  </p>
                </div>

                <div class="ps">
                  <small
                    >This message was intended for ${payload.username}. If you did not initiate a
                    password reset on Afrolay&trade;, please ignore this email.</small
                  >
                </div>
              </main>
            </div>
          </body>
        </html>`,
    };
};
exports.resetPasswordSuccessMail = resetPasswordSuccessMail;
//# sourceMappingURL=index.js.map