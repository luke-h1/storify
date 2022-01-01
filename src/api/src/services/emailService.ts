/* eslint-disable consistent-return */
/* eslint-disable no-console */

import formData from 'form-data';
import Mailgun from 'mailgun.js';
import nodemailer from 'nodemailer';

const mailgun = new Mailgun(formData);

const client = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY,
});

const emailService = {
  sendEmail: async (
    from: string,
    to: string,
    subject: string,
    html: string,
  ) => {
    if (process.env.NODE_ENV === 'production') {
      try {
        const res = await client.messages.create(
          process.env.EMAIL_DOMAIN_NAME,
          {
            from,
            to,
            subject,
            text: html,
          },
        );

        console.log('sent email', res);
      } catch (e) {
        console.error(e);
      }
    } else {
      const testAccount = await nodemailer.createTestAccount();

      const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      const result = await transporter.sendMail({
        from,
        to,
        subject,
        html,
      });
      if (result.accepted) {
        console.log('Email sent: %s', result.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(result));
      } else {
        console.error('Problem sending email');
      }
    }
  },
};

export default emailService;
