"use server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  const userId = req.headers.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "L'ID utilisateur est requis." },
      { status: 400 }
    );
  }

  try {
    const moyenpaiement = await db.moyenpaiement.findMany({
      where: {
        userId: parseInt(userId, 10),
      },
    });

    return NextResponse.json(moyenpaiement, { status: 200 });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des moyens de paiement :",
      error
    );
    return NextResponse.json(
      { error: "Erreur lors de la récupération des moyens de paiement." },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    if (!id) {
      console.error("ID manquant");
      return NextResponse.json({ message: "ID manquant" }, { status: 400 });
    }

    const deletedAnnonces = await db.moyenpaiement.delete({
      where: { id: parseInt(id, 10) },
    });

    if (!deletedAnnonces) {
      console.error("Annonces non trouvé");
      return NextResponse.json(
        { message: "Annonce non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Annonces et images supprimés avec succès",
      annonce: deletedAnnonces,
    });
  } catch (error) {
    console.error(
      "Erreur lors de la suppression de l'annonce ou de l'image:",
      error
    );
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
