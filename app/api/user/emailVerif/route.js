import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

async function sendVerificationEmail(email, prenom, verificationCode) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: "Vérification de vos informations personnelles",
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
      

      <div style="background-color: #FCA311; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Vérification de l'adresse mail</h1>
      </div>

      <div style="padding: 20px; line-height: 1.5; color: #333333;">
        <p style="font-size: 16px; margin-bottom: 15px;">Bonjour ${prenom}, </p>

        <p style="font-size: 16px; margin-bottom: 15px;">
          Votre code de vérification est le suivant :
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <p style="font-size : 40px; display: inline-block; padding: 12px 24px; background-color:  #fdf3e1; color: #FCA311; text-decoration: none; border-radius: 4px; font-weight: bold;">
            ${verificationCode}
          </p> 
        </div>

        <p style="font-size: 16px; margin-bottom: 15px;">À bientôt,</p>
        <p style="font-size: 16px; font-weight: bold;">L'équipe de Lilee</p>
      </div>

      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
        <p>© 2024 Lilee. Tous droits réservés.</p>
      </div>
    </div>
  `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email de vérification envoyé avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de vérification :", error);
    throw new Error("Erreur lors de l'envoi de l'e-mail");
  }
}

export async function POST(req) {
  const { email, prenom, verificationCode } = await req.json();

  if (!email || !prenom || !verificationCode) {
    return NextResponse.json(
      { error: "Tous les champs sont requis." },
      { status: 400 }
    );
  }

  try {
    await sendVerificationEmail(email, prenom, verificationCode);
    return NextResponse.json(
      { message: "E-mail envoyé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
