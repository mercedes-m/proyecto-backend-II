import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendResetPasswordEmail = async (email, token) => {
  const resetLink = `http://frontend/reset-password?token=${token}`;

  const mailOptions = {
    from: `"Ecommerce" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Recuperación de contraseña',
    html: `
      <p>Recibimos una solicitud para restablecer tu contraseña.</p>
      <p>Haz clic en el siguiente enlace para crear una nueva contraseña. El enlace expirará en 1 hora.</p>
      <a href="${resetLink}">Restablecer contraseña</a>
      <p>Si no solicitaste este cambio, ignora este correo.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Correo de recuperación enviado a ${email}`);
  } catch (error) {
    console.error('Error al enviar correo de recuperación:', error);
    throw new Error('No se pudo enviar el correo de recuperación');
  }
};