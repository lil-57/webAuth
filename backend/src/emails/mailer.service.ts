import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export const sendMagicLinkEmail = async (to: string, url: string) => {
  return transporter.sendMail({
    from: `"WebAuth" <${process.env.GMAIL_USER}>`,
    to,
    subject: 'Votre lien magique',
    html: `<p>Cliquez ici pour vous connecter : <a href="${url}">${url}</a></p>`,
  });
};
