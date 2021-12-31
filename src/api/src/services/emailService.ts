/* eslint-disable consistent-return */
/* eslint-disable no-console */

import formData from 'form-data';
import Mailgun from 'mailgun.js';

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
    text: string,
  ) => {
    try {
      const res = await client.messages.create(process.env.EMAIL_DOMAIN_NAME, {
        from,
        to,
        subject,
        text,
      });

      console.log('sent email', res);
    } catch (e) {
      console.error(e);
    }
  },
};

export default emailService;
