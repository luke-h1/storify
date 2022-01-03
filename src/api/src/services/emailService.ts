/* eslint-disable consistent-return */
/* eslint-disable no-console */
import AWS from 'aws-sdk';
import { Destination } from 'aws-sdk/clients/ses';
import nodemailer from 'nodemailer';

const ses = new AWS.SES({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
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
        const res = ses.sendEmail({
          Destination: to as Destination,
          Source: process.env.AWS_SES_FROM_EMAIL_ADDRESS,
          Message: {
            Body: {
              Text: {
                Data: html,
              },
            },
            Subject: {
              Data: subject,
            },
          },
        });
        console.log('send ses email', res);
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
