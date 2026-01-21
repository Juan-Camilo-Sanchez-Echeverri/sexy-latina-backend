import { envs } from '@configs';

import { header } from './sections/header.section';
import { footer } from './sections/footer.section';

const URL = `${envs.frontPublicUrl}/activate-account`;

interface Data {
  email: string;
  token: string;
  firstName: string;
}

export const activateAccount = (data: Data) => {
  const { email, token, firstName } = data;
  return `
    <!doctype html>
    <html lang="es">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <title>Activar cuenta</title>
    </head>
    <body style="margin:0;padding:0;background-color:#ffffff;font-family:'Poppins', Arial, Helvetica, sans-serif;">
      <div style="display:none;max-height:0px;overflow:hidden;">Activa tu cuenta en Piemce</div>

      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center" style="padding:20px 10px;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;background:#ffffff;border-radius:8px;overflow:hidden;">
              <tr>
                <td style="padding:0;text-align:center;">
                  ${header}
                </td>
              </tr>
              <tr>
                <td style="padding:16px 30px;color:#555;font-size:15px;line-height:20px;text-align:center;">
                  <p style="margin:0 0 8px 0;font-weight:700;display:inline-block;font-size:18px;line-height:20px;color: #000000;">¡Hola!</p>
                  <p style="margin:0 0 8px 0;display:inline-block;font-weight:600;font-size:18px;line-height:27px;color: #000000;">&nbsp;${firstName}</p>
                  <p style="margin:16px 0 8px 0;font-size:15px;line-height:20px;font-weight:400;color: #000000;">
                  ¡Estamos muy felices de tenerte con nosotros!</p>
                  <p style="margin:0 0 8px 0;font-size:15px;line-height:20px;font-weight:400;color: #000000;">Para completar tu registro y empezar a disfrutar de Piemce, por favor activa tu cuenta.</p>
                  <p style="margin:16px 0 8px 0;font-size:15px;line-height:20px;font-weight:400;color: #000000;">Haz clic en el siguiente botón:</p>

                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin:16px 0 0 0;">
                    <tr>
                      <td align="center" style="padding:0;">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td bgcolor="#A07FF8" style="border-radius:5px; text-align:center;">
                              <a href="${URL}?email=${email}&token=${token}" target="_blank" style="display:block;width:100%;padding:12px 0;color:#ffffff;text-decoration:none;font-weight:bold;">Activar cuenta</a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  <p style="margin:12px 0 4px 0;color: #8A8A8E;font-size:10px;line-height:15px;font-weight:400;text-align:center;">Si no te registraste en Piemce, simplemente ignora este mensaje.</p>
                  <p style="margin:8px 0 0 0;color: #000000;font-size:15px;line-height:20px;font-weight:400;text-align:center;">Si necesitas ayuda, no dudes en contactarnos.</p>
                  <p style="margin:4px 0 0 0;color: #000000;font-size:15px;line-height:20px;font-weight:400;text-align:center;">¡Estamos felices de ayudarte!</p>
                </td>
              </tr>
              <tr>
                <td style="padding:0;text-align:center;">
                  ${footer}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};
