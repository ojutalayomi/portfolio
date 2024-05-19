import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function sendEmail(head: string, email: string) {

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'Ayomide Ojutalayo', // sender address
    to: email,
    subject: 'Feedback Received',
    html: `
      <h1>Hi ${head}</h1>
      <p>Thanks for contacting me.</p>
      <p>You will get a response as soon as possible.</p>
    `,
  });

  console.log('Message sent: %s', info.messageId);
}
export async function sendEmailToMe(head: string, email: string, subject: string, message: string) {

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: head, // sender address
    to: process.env.EMAIL_USER,
    subject: subject,
    html: `
      <h1>Hi, you've got a message from ${head}</h1>
      <p>Email Address: ${email}</p>
      <p>${subject}</p>
      <p>${message}</p>
    `,
  });

  console.log('Message sent: %s', info.messageId);
}
