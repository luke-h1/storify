/* eslint-disable consistent-return */
/* eslint-disable no-console */
import AWS from 'aws-sdk';

const ses = new AWS.SES({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
});

const emailService = {
  sendEmail: (to: string, subject: string, message: string, from: string) => {
    const params = {
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: message,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
      ReturnPath: from,
      Source: from,
    };

    ses.sendEmail(params, (e, data) => {
      if (e) {
        return e;
      }
      console.log('email sent', data);
    });
  },
};
export default emailService;
