import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { id } = params;
  console.log("ID reçu :", id);

  if (!id) {
    return NextResponse.json(
      { error: "L'ID info paiement est requis." },
      { status: 400 }
    );
  }

  try {
    const moyenpaiement = await db.moyenpaiement.findMany({
      where: {
        id: parseInt(id, 10),
      },
      select: {
        id: true,
        cardNumber: true,
        cardExpiry: true,
        cardCVC: true,
        nameOnCard: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
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
