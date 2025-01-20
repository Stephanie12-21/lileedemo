import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const transactions = await db.transactions.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        annonce: {
          include: {
            user: true,
          },
        },
        user: true,
      },
    });

    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des transactions :", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
