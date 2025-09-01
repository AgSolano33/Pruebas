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
  const verificationLink = `${baseUrl}/verify?token=${token}`;

  const mailOptions = {
    from: '"Community Lab" <no-reply@communitylab.com>',
    to,
    subject: "¡Gracias por tu interés en Community Lab!",
    html: `
      <p><strong>Estimado(a) ${nombre}:</strong></p>
      <p>¡Gracias por tu pre registro en <strong>Community Lab!</strong></p>
      <p>Nos llena de entusiasmo que quieras formar parte de nuestra red de soluciones.</p>
      <p>
        Valida tu correo electrónico 
        <a href="${verificationLink}" style="color:#1F6FA3; font-weight:bold;">aquí</a> 
        para que puedas tener acceso a tus proyectos.
      </p>
      <p>
        Si tienes alguna duda durante el proceso, nuestro equipo estará encantado de apoyarte al 
        <a href="tel:+526144613032" style="color:#1F6FA3;">+52 (614) 461 3032</a>.
      </p>
      <p>Con entusiasmo,<br><strong>El equipo de Community Lab</strong></p>
            <div style="margin-top:30px;">
        <img src="https://pruebas-z15b.vercel.app/icon.png" 
             alt="Community Lab Logo" 
             style="max-height:80px;" />
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}
