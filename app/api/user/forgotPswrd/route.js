import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";

async function sendVerificationEmail(email, prenom, resetLink) {
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
    subject: "Réinitialisation de mot de passe",
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
      

      <div style="background-color: #FCA311; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Réinitialisation de mot de passe</h1>
      </div>

      <div style="padding: 20px; line-height: 1.5; color: #333333;">
        <p style="font-size: 16px; margin-bottom: 15px;">Bonjour ${prenom}, </p>

        <p style="font-size: 16px; margin-bottom: 15px;">
        Cliquez sur le bouton ci-dessous pour réinitialiser votre mot de passe (valide pendant 5 minutes) :
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a  href="${resetLink}" 
             style="display: inline-block; padding: 12px 24px; background-color:  #fdf3e1; color: #FCA311; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Réinitialiser le mot de passe
          </a>
          
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
    console.log("Email de réinitialisation envoyé avec succès !");
  } catch (error) {
    console.error(
      "Erreur lors de l'envoi de l'email de réinitialisation :",
      error
    );
    throw new Error("Erreur lors de l'envoi de l'e-mail");
  }
}

export async function POST(req) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json(
      { error: "L'adresse email est requise." },
      { status: 400 }
    );
  }

  const user = await db.user.findUnique({
    where: { email },
    select: {
      id: true,
      prenom: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Aucun utilisateur trouvé avec cet e-mail." },
      { status: 404 }
    );
  }

  const { id, prenom } = user;

  const resetToken = jwt.sign({ email, id }, process.env.JWT_SECRET, {
    expiresIn: "5m",
  });
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  try {
    await sendVerificationEmail(email, prenom, resetLink);
    return NextResponse.json(
      { message: "E-mail envoyé avec succès", userId: id },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
