import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const totalUsers = await db.user.count();
    const totalAnnonces = await db.annonces.count();
    const totalEntreprises = await db.company.count();
    const totalPartenaires = await db.partenaire.count();

    const userStats = await db.$queryRaw`
      SELECT DATE("createdAt") as date, COUNT(id) as count
      FROM "user"
      GROUP BY DATE("createdAt")
      ORDER BY DATE("createdAt") ASC;
    `;

    const annonceStats = await db.$queryRaw`
      SELECT DATE("createdAt") as date, COUNT(id) as count
      FROM "annonces"
      GROUP BY DATE("createdAt")
      ORDER BY DATE("createdAt") ASC;
    `;

    const companyStats = await db.$queryRaw`
      SELECT DATE("createdAt") as date, COUNT(id) as count
      FROM "company"
      GROUP BY DATE("createdAt")
      ORDER BY DATE("createdAt") ASC;
    `;

    const partenaireStats = await db.$queryRaw`
      SELECT DATE("createdAt") as date, COUNT(id) as count
      FROM "partenaire"
      GROUP BY DATE("createdAt")
      ORDER BY DATE("createdAt") ASC;
    `;

    const allDates = [
      ...userStats.map((entry) => entry.date),
      ...annonceStats.map((entry) => entry.date),
      ...companyStats.map((entry) => entry.date),
      ...partenaireStats.map((entry) => entry.date),
    ];

    const uniqueDates = [...new Set(allDates)].sort();

    const dailyStats = uniqueDates.map((date) => {
      const userCount =
        userStats.find((entry) => entry.date === date)?.count || 0;
      const annonceCount =
        annonceStats.find((entry) => entry.date === date)?.count || 0;
      const companyCount =
        companyStats.find((entry) => entry.date === date)?.count || 0;
      const partenaireCount =
        partenaireStats.find((entry) => entry.date === date)?.count || 0;

      return {
        date: date,
        utilisateurs: userCount.toString(),
        annonces: annonceCount.toString(),
        entreprises: companyCount.toString(),
        partenaires: partenaireCount.toString(),
      };
    });

    const dailyTotal = dailyStats.reduce(
      (acc, current) => {
        acc.utilisateurs += parseInt(current.utilisateurs);
        acc.annonces += parseInt(current.annonces);
        acc.entreprises += parseInt(current.entreprises);
        acc.partenaires += parseInt(current.partenaires);
        return acc;
      },
      { utilisateurs: 0, annonces: 0, entreprises: 0, partenaires: 0 }
    );

    return NextResponse.json(
      {
        totalUsers: totalUsers.toString(),
        totalAnnonces: totalAnnonces.toString(),
        totalEntreprises: totalEntreprises.toString(),
        totalPartenaires: totalPartenaires.toString(),
        dailyStats,
        dailyTotal,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
