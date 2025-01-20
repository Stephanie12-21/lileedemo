import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";

export async function PUT(request, { params }) {
  try {
    const { userId } = params;
    const { password } = await request.json();

    if (!userId) {
      return new NextResponse(JSON.stringify({ message: "ID manquant" }), {
        status: 400,
      });
    }

    if (!password) {
      return new NextResponse(
        JSON.stringify({ message: "Le mot de passe est requis." }),
        {
          status: 400,
        }
      );
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const updatedUser = await db.user.update({
      where: { id: parseInt(userId, 10) },
      data: {
        hashPassword: hashedPassword,
      },
    });

    if (!updatedUser) {
      return new NextResponse(
        JSON.stringify({ message: "Utilisateur non trouvé." }),
        {
          status: 404,
        }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: "Mot de passe réinitialisé avec succès!" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    // En cas d'erreur serveur, retourner un message générique
    return new NextResponse(
      JSON.stringify({
        message: "Erreur lors de la réinitialisation du mot de passe.",
      }),
      {
        status: 500,
      }
    );
  }
}
