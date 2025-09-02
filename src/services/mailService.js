import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 587,
  secure: false, // true para 465, false para otros
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendPasswordResetEmail = async (email, token) => {
  const resetLink = `http://localhost:5173/reset-password?token=${token}`; 
  // reemplazar con la URL real de frontend

  const mailOptions = {
    from: `"Soporte" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Recuperación de contraseña",
    html: `
      <h2>Recuperación de contraseña</h2>
      <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>Este enlace expira en 1 hora.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};