import { envs } from '@configs';

interface Data {
  email: string;
  token: string;
  name: string;
}

export const recoverPassword = (data: Data) => {
  const { email, token, name } = data;
  const resetUrl = `${envs.frontPublicUrl}/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;

  return `
    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <title>Reset your password</title>
    </head>
    <body style="margin:0;padding:0;background-color:#ffffff;font-family:'Poppins', Arial, Helvetica, sans-serif;">
      <div style="display:none;max-height:0px;overflow:hidden;">Reset your password on Sexy Latina</div>

      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center" style="padding:20px 10px;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;background:#ffffff;border-radius:8px;overflow:hidden;">
              <tr>
                <td style="padding:16px 30px;color:#555;font-size:15px;line-height:20px;text-align:center;">
                  <p style="margin:0 0 8px 0;font-weight:700;display:inline-block;font-size:18px;line-height:20px;color: #000000;">Hello,</p>
                  <p style="margin:0 0 8px 0;display:inline-block;font-weight:600;font-size:18px;line-height:27px;color: #000000;">&nbsp;${name}!</p>
                  <p style="margin:16px 0 8px 0;font-size:15px;line-height:20px;font-weight:400;color: #000000;">We received a request to reset your password.</p>
                  <p style="margin:0 0 8px 0;font-size:15px;line-height:20px;font-weight:400;color: #000000;">Don't worry, we're here to help. Click the button below:</p>

                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin:16px 0 0 0;">
                    <tr>
                      <td align="center" style="padding:0;">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td bgcolor="#A07FF8" style="border-radius:5px; text-align:center;">
                              <a href="${resetUrl}" target="_blank" style="display:block;width:100%;padding:12px 0;color:#ffffff;text-decoration:none;font-weight:bold;">Reset password</a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <p style="margin:16px 0 4px 0;color: #8A8A8E;font-size:11px;line-height:16px;font-weight:400;text-align:center;">
                    If the button doesn't work, copy and paste the link below into your browser:
                  </p>
                  <p style="margin:0 0 12px 0;font-size:11px;line-height:16px;text-align:center;word-break:break-all;">
                    <a href="${resetUrl}" target="_blank" style="color:#A07FF8;text-decoration:underline;">${resetUrl}</a>
                  </p>

                  <p style="margin:12px 0 4px 0;color: #8A8A8E;font-size:10px;line-height:15px;font-weight:400;text-align:center;">If you didn't request this change, simply ignore this message.</p>
                  <p style="margin:0 0 0 0;color: #8A8A8E;font-size:10px;line-height:15px;font-weight:400;text-align:center;">Your account will remain secure.</p>
                  <p style="margin:8px 0 0 0;color: #000000;font-size:15px;line-height:20px;font-weight:400;text-align:center;">If you need help, don't hesitate to contact us.</p>
                  <p style="margin:4px 0 0 0;color: #000000;font-size:15px;line-height:20px;font-weight:400;text-align:center;">We're happy to help!</p>
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
