import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();

    const testimony = body.testimony;
    const rating = parseInt(body.rating, 10);
    const userId = parseInt(body.userId, 10);
    const ville = body.city;
    const pays = body.country;

    if (!testimony || isNaN(rating) || isNaN(userId) || !ville || !pays) {
      return NextResponse.json(
        {
          message: "Tous les champs sont requis et doivent être valides.",
        },
        { status: 400 }
      );
    }

    const newTestimony = await db.temoignages.create({
      data: {
        temoignage: testimony,
        noteLilee: rating,
        userId: userId,
        ville: ville,
        pays: pays,
      },
    });

    return NextResponse.json(
      {
        message: "Témoignage créé avec succès",
        testimony: newTestimony,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la création du témoignage:", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
