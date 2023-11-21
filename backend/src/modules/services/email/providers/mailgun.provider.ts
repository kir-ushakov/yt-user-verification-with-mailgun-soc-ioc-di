import formData from 'form-data';
import Mailgun from 'mailgun.js';

const mailgun = new Mailgun(formData);

const mailgunProvider = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY as string,
});

export { mailgunProvider };
