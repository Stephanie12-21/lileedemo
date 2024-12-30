import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Nombre total de partenaires
    const totalPartenaires = await db.engagement.count();

    // Statistiques par date
    const partenaireStats = await db.$queryRaw`
      SELECT DATE("createdAt") as date, COUNT(id) as count
      FROM "engagement"
      GROUP BY DATE("createdAt")
      ORDER BY DATE("createdAt") ASC;
    `;

    console.log(
      "Statistiques partenaires :",
      JSON.stringify(partenaireStats, null, 2)
    );

    // Extraire les dates uniques
    const uniqueDates = [
      ...new Set(partenaireStats.map((entry) => entry.date)),
    ].sort();
    console.log("Dates uniques :", uniqueDates);

    // Statistiques journalières
    const dailyStats = uniqueDates.map((date) => {
      const partenaireEntry = partenaireStats.find(
        (entry) => entry.date === date
      );
      const partenaireCount = partenaireEntry ? partenaireEntry.count : 0;

      return {
        date: date,
        partenaires: partenaireCount.toString(),
      };
    });

    console.log("Statistiques journalières :", dailyStats);

    // Calculer le total quotidien
    const dailyTotal = dailyStats.reduce(
      (acc, current) => {
        acc.partenaires += parseInt(current.partenaires);
        return acc;
      },
      { partenaires: 0 }
    );

    console.log("Total quotidien :", dailyTotal);

    // Réponse JSON
    return NextResponse.json(
      {
        totalPartenaires: totalPartenaires.toString(),
        dailyStats,
        dailyTotal,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données :",
      error.message
    );
    console.error(error.stack);
    return NextResponse.json(
      { message: `Erreur interne du serveur : ${error.message}` },
      { status: 500 }
    );
  }
}
