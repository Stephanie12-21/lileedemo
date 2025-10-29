import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Récupérer le SIRET depuis la requête
    const { siret } = await request.json();

    if (!siret) {
      return NextResponse.json(
        { valid: false, data: null, errorMessage: "Le SIRET est requis." },
        { status: 400 }
      );
    }

    // Supprimer les espaces et vérifier la longueur
    const sanitizedSiret = siret.replace(/\s/g, "");
    if (!/^\d{14}$/.test(sanitizedSiret)) {
      return NextResponse.json(
        {
          valid: false,
          data: null,
          errorMessage: "Le SIRET doit contenir 14 chiffres.",
        },
        { status: 400 }
      );
    }

    // Extraire les 9 premiers chiffres (SIREN) pour Pappers
    const siren = sanitizedSiret.slice(0, 9);

    const apiKey = process.env.NEXT_PUBLIC_PAPPERS_API_KEY || "";
    const response = await fetch(
      `https://api.pappers.fr/v2/entreprise?siren=${siren}&api_token=${apiKey}`
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          valid: false,
          data: null,
          errorMessage: "Impossible de récupérer les données.",
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Données reçues de Pappers :", data);

    if (data && Object.keys(data).length > 0) {
      return NextResponse.json({ valid: true, data, errorMessage: "" });
    } else {
      return NextResponse.json({
        valid: false,
        data: null,
        errorMessage: "Entreprise introuvable.",
      });
    }
  } catch (error) {
    console.error("Erreur lors de la vérification du SIRET :", error);
    return NextResponse.json({
      valid: false,
      data: null,
      errorMessage: "Erreur serveur lors de la vérification du SIRET.",
    });
  }
}
