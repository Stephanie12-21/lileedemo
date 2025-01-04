import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    "La clé secrète Stripe est manquante dans les variables d'environnement"
  );
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function POST(request) {
  try {
    const body = await request.json();

    const requiredFields = [
      "annonceId",
      "userId",
      "userName",
      "userEmail",
      "userPhone",
      "ville",
      "adresse",
      "codePostal",
      "selectedCountry",
      "total",
      "successUrl",
      "cancelUrl",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        throw new Error(`Le champ requis "${field}" est manquant.`);
      }
    }

    const {
      annonceId,
      userId,
      userName,
      userEmail,
      userPhone,
      ville,
      adresse,
      codePostal,
      selectedCountry,
      total,
      successUrl,
      cancelUrl,
    } = body;

    console.log("Données reçues:", {
      annonceId,
      userId,
      userName,
      userEmail,
      userPhone,
      total,
      ville,
      codePostal,
      adresse,
      selectedCountry,
      successUrl,
      cancelUrl,
    });

    const unitAmount = parseInt(total, 10);
    if (isNaN(unitAmount) || unitAmount <= 0) {
      throw new Error(
        "Le montant total doit être un nombre valide et supérieur à zéro."
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Paiement pour l'annonce #${annonceId}`,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: userId,
      customer_email: userEmail,
      metadata: {
        userId,
        userName,
        userPhone,
        userEmail,
        annonceId: annonceId.toString(),
        total,
        ville,
        selectedCountry,
        adresse,
        codePostal,
      },
    });

    return new Response(JSON.stringify({ sessionId: session.id }), {
      status: 200,
    });
  } catch (error) {
    console.error(
      "Erreur lors de la création de la session Stripe:",
      error.message
    );
    return new Response(
      JSON.stringify({ error: error.message || "Erreur interne du serveur" }),
      { status: 400 }
    );
  }
}
