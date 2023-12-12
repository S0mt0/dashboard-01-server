import { v4 as uuid } from "uuid";

const { FRONTEND_BASEURL } = process.env;

/**
 * HTML content is expected to be compiled by HandleBars in order to apply styling and insert required parameters
 * @param token
 * @param username
 * @param platform
 * @returns Text and HTML content for mailing
 */
export const passwordReset = ({
  token,
  username,
  platform,
}: {
  token: string | number;
  username: string;
  platform?: string;
}) => {
  const link = `${FRONTEND_BASEURL}/forgot-password?token=${token}`;
  const year = new Date().getFullYear();

  return {
    text: `Dear ${username}, You requested to reset your password on ${platform}. Use the 6-digit token below to initiate a password reset. Or, you can securely follow the ${link} to continue. Token is valid for 15 minutes.`,

    html: `
            <html lang="en">
            <head>
                {{{ styles }}}
            </head>
            <body>
                <header />
                    <main>
                        <p>Dear <span>{{username}}</span>,
                        <span style="display: none !important">${uuid()}</span>
                        </p>
                        <p>You requested to reset your password on {{platform}}.
                        <span style="display: none !important">${uuid()}</span></p>
                        <p>Use the 6-digit token below to initiate a password reset. Or, you can securely follow the {{link}} to continue.
                        <span style="display: none !important">${uuid()}</span>
                        </p>

                        <h3>{{token}}
                        <span style="display: none !important">${uuid()}</span>
                        </h3>

                        <p>Token is valid for 15 minutes.
                        <span style="display: none !important">${uuid()}</span>
                        </p>

                        <p>Thanks for helping us keep your account secure.
                        <span style="display: none !important">${uuid()}</span>
                        </p>

                        <article>
                            <small
                            >This message was intended for {{username}}. If you did not request a
                            password reset from {{platform}}, please ignore this email.</small
                            >
                            <span style="display: none !important">${uuid()}</span>
                        </article>
                    </main>
                    <footer>
                    <span>&copy; ${year}.
                    <span style="display: none !important">${uuid()}</span></span>
                    </footer>
            </body>
            </html>
    
    `,
  };
};
