import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { siret } = await req.json();

    if (!siret || !/^\d{14}$/.test(siret)) {
      return NextResponse.json(
        { error: "SIRET invalide : doit contenir exactement 14 chiffres." },
        { status: 400 }
      );
    }

    // --- Récupération TOKEN depuis la nouvelle API INSEE ---
    const tokenResponse = await fetch(
      "https://portail-api.insee.fr/api/oauth/token",
      {
        method: "POST",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(
              `${process.env.INSEE_CLIENT_ID}:${process.env.INSEE_CLIENT_SECRET}`
            ).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials&scope=openid", // IMPORTANT
      }
    );

    // Vérification réponse du token
    let tokenData;
    try {
      tokenData = await tokenResponse.json();
    } catch {
      return NextResponse.json(
        { error: "Réponse invalide du serveur INSEE (token)" },
        { status: 500 }
      );
    }

    if (!tokenData.access_token) {
      return NextResponse.json(
        { error: "Impossible d’obtenir un token INSEE" },
        { status: 500 }
      );
    }

    // --- Vérification du SIRET ---
    const verifyResponse = await fetch(
      `https://api.insee.fr/entreprises/sirene/V3.11/siret/${siret}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          Accept: "application/json",
        },
      }
    );

    if (verifyResponse.status === 404) {
      return NextResponse.json(
        { valid: false, message: "SIRET introuvable." },
        { status: 404 }
      );
    }

    if (!verifyResponse.ok) {
      return NextResponse.json(
        { error: "Erreur lors de la vérification du SIRET." },
        { status: 500 }
      );
    }

    const data = await verifyResponse.json();

    return NextResponse.json({
      valid: true,
      company: data.etablissement,
    });
  } catch (error) {
    console.error("Erreur serveur :", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la vérification du SIRET" },
      { status: 500 }
    );
  }
}
