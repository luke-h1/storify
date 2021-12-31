/* eslint-disable consistent-return */
/* eslint-disable no-console */

import formData from 'form-data';
import Mailgun from 'mailgun.js';

const mailgun = new Mailgun(formData);
const client = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY,
});

const messageData = {
  from: 'Excited User <me@samples.mailgun.org>',
  to: 'foo@example.com, bar@example.com',
  subject: 'Hello',
  text: 'Testing some Mailgun awesomeness!',
};

client.messages
  .create(process.env.DOMAIN_NAME, messageData)
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.error(err);
  });

const emailService = {};
export default emailService;
