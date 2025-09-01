import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendVerificationEmail(to, nombre, token) {
  // Usa variable de entorno
  const baseUrl = process.env.NEXTAUTH_URL || "https://pruebas-z15b.vercel.app";
  // 👉 el link debe apuntar a /verify (página), no al endpoint /api/verify
  const verificationLink = `${baseUrl}/verify?token=${token}`;

  const mailOptions = {
    from: '"Community Lab" <no-reply@communitylab.com>',
    to,
    subject: "¡Gracias por tu interés en Community Lab!",
    html: `
      <p>Estimado(a) <strong>${nombre}</strong>:</p>
      <p>¡Gracias por tu pre registro en Community Lab!</p>
      <p>Nos llena de entusiasmo que quieras formar parte de nuestra red de soluciones.</p>
      <p>Valida tu correo electrónico <a href="${verificationLink}">aquí</a> para que puedas tener acceso a tus proyectos.</p>
      <p>Si tienes alguna duda durante el proceso, nuestro equipo estará encantado de apoyarte al +52 (614) 461 3032.</p>
      <p>Con entusiasmo,<br>El equipo de Community Lab</p>
    `,
  };

  return transporter.sendMail(mailOptions);
}
