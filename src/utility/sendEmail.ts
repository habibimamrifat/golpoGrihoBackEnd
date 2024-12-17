import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: `${config.companyGmail}`,
        pass: `${config.GmailAppPassword}`,
      },
    });
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: `${config.companyGmail}`, // sender address
      to, // list of receivers
      subject, // Subject line
      text: 'This E-mail is from Golpo Griho', // plain text body
      html, // html body
    });

    // console.log('Message sent: %s', info.messageId,"info is", info);
  } catch (err) {
    console.log(err);
    throw Error('fasiled to send E-mail');
  }
};
