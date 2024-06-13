import nodemailer from 'nodemailer'


let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
      user: process.env.MAIL_ADMIN, 
      pass: process.env.MAIL_PASS 
  }
});

const sendEmail = async (to, subject, message) => {
    const info = await transporter.sendMail({
        from: '"INSTAGRAM👻" <datltph41025@fpt.edu.vn>',
        to, // list of receivers
        subject, // Subject line
        html: message, // html body
    })
    return info
}

export default sendEmail