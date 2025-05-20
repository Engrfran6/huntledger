// app/api/send-email/route.ts
import * as brevo from '@getbrevo/brevo';
import {NextResponse} from 'next/server';

export async function POST(request: Request) {
  try {
    const {to, subject, html} = await request.json();

    let apiInstance = new brevo.TransactionalEmailsApi();

    if (!process.env.BREVO_API_KEY) {
      throw new Error('BREVO_API_KEY is not defined in environment variables');
    }
    apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

    let sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.sender = {
      name: 'HuntLedger Inc',
      email: 'no-reply@huntledger.com',
    };
    sendSmtpEmail.to = [{email: to}];
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;

    // Send email
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);

    return NextResponse.json({success: true, data});
  } catch (error: any) {
    console.error('Email error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Unknown error',
        ...(error.response?.body ? {details: error.response.body} : {}),
      },
      {status: 500}
    );
  }
}
