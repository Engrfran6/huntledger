import * as brevo from '@getbrevo/brevo';

export const sendEmail = async ({
  to,
  subject,
  html,
  text = 'Please view this email in an HTML-compatible client',
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<boolean> => {
  try {
    if (!process.env.BREVO_API_KEY) {
      throw new Error('BREVO_API_KEY is not defined');
    }

    const apiInstance = new brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.sender = {
      name: 'HuntLedger Inc',
      email: 'no-reply@huntledger.com',
    };
    (sendSmtpEmail.replyTo = {
      email: 'support@huntledger.com',
      name: 'HuntLedger Support',
    }),
      (sendSmtpEmail.to = [{email: to}]);
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;
    (sendSmtpEmail.textContent = text),
      (sendSmtpEmail.headers = {
        'X-Mailer': 'HuntLedger',
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
      });

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    return true;
  } catch (error) {
    console.error('Error sending email directly:', error);
    return false;
  }
};
