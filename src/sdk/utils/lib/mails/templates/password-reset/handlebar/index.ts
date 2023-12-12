import handlebars from "handlebars";

import { passwordReset } from "../template";

/**
 *Returns the handlebar compiled HTML content for password-reset mail
 * @function
 * @param payload
 */
export const resetPasswordHtmlMailContent = (payload: {
  token: string | number;
  username: string;
  platform?: string;
}) => {
  const template = handlebars.compile(passwordReset(payload).html);

  const html = template({
    ...payload,

    styles: `
        <style>
        main{
            padding: 0 1rem;
        }
        header {
            background: #3f5bf6;
            height: 3rem;
        }

        p {
            color: #474747;
            margin-block: 1rem;
            line-height: 2;
        }

        h1 {
            margin-bottom: 2rem;
            font-size: 2.6rem;
            color: #3f5bf6;
            text-transform: capitalize;
        }

        p{
            color: #3f5bf6;
        }

        p span {
            text-transform: capitalize;
            font-weight: 600;
        }

        p strong {
            margin-right: 6px;
        }

        h3 {
            color: #27282b;
            text-align: center;
            font-weight: 700;
            font-size: 1.7rem;
        }

        h3 span{
            text-transform: capitalize;
        }

        footer {
            padding: 1rem;
            text-align: center;
            background: #d8d9e3;
            margin: 0 auto;
            margin-top: 1rem;
            width: 95%;
            max-width: 700px;
            border-radius: 8px;
        }

        footer span {
            font-size: 0.8rem;
        }
        </style>
    `,
  });

  return { html };
};
