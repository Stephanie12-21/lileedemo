import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.formData();
    console.log("FormData récupéré :", body);
    const nom = body.get("nomComplet");
    const adresse = body.get("adresse");
    const codePostal = body.get("codePostal");
    const ville = body.get("ville");
    const selectedCountry = body.get("selectedCountry");
    const userId = parseInt(body.get("userid"));

    if (
      !nom ||
      !adresse ||
      !codePostal ||
      !ville ||
      !selectedCountry ||
      !userId
    ) {
      return NextResponse.json(
        { message: "Tous les champs sont requis." },
        { status: 400 }
      );
    }

    console.log("db :", db);
    console.log("db.adresseFacturation :", db.adresseFacturation);

    // Création de l'adresse de facturation dans la base de données
    const newFacturation = await db.adresseFacturation.create({
      data: {
        nom,
        adresse,
        codePostal,
        ville,
        pays: selectedCountry,
        userId,
      },
    });
    console.log("Adresse de facturation créée :", newFacturation);

    // Réponse en cas de succès
    return NextResponse.json(
      {
        message: "Adresse de facturation créée avec succès.",
        adresseFacturation: newFacturation,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Erreur lors de la création de l'adresse de facturation :",
      error
    );

    // Réponse en cas d'erreur serveur
    return NextResponse.json(
      { message: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = parseInt(searchParams.get("userid"));

    // Validation du paramètre requis
    if (!userId) {
      return NextResponse.json(
        { message: "Le paramètre 'userid' est requis." },
        { status: 400 }
      );
    }

    // Récupération des données dans la base
    const facturationData = await db.adresseFacturation.findMany({
      where: { userId },
    });

    // Vérification si des données existent
    if (facturationData.length === 0) {
      return NextResponse.json(
        { message: "Aucune donnée trouvée pour cet utilisateur." },
        { status: 404 }
      );
    }

    // Réponse avec les données récupérées
    return NextResponse.json(
      {
        message: "Données récupérées avec succès.",
        adresseFacturation: facturationData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données d'adresse de facturation :",
      error
    );

    // Réponse en cas d'erreur serveur
    return NextResponse.json(
      { message: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
