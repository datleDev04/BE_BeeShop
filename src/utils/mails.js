import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.MAIL_ADMIN,
    pass: process.env.MAIL_PASS,
  },
});
