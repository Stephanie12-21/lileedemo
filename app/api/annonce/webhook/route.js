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

    const { abonnementId, userId, userName, userEmail, successUrl, cancelUrl } =
      body;

    console.log("Données reçues:", {
      abonnementId,
      userId,
      userName,
      userEmail,
      successUrl,
      cancelUrl,
    });

    const prices = {
      1: { amount: 799, interval: "month" },
      2: { amount: 1999, interval: "month" },
      3: { amount: 3999, interval: "month" },
    };

    const priceData = prices[abonnementId];
    if (!Number.isInteger(priceData.amount)) {
      throw new Error(
        `Le montant n'est pas un entier valide: ${priceData.amount}`
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Abonnement ${abonnementId}`,
              description: `Abonnement choisi par ${userName}`,
            },
            unit_amount: priceData.amount,
            recurring: {
              interval: priceData.interval,
            },
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: userId,
      customer_email: userEmail,
      metadata: {
        userId: userId,
        userName: userName,
        abonnementId: abonnementId.toString(),
      },
    });
    return new Response(JSON.stringify({ sessionId: session.id }), {
      status: 200,
    });
  } catch (error) {
    console.error("Erreur lors de la création de la session Stripe:", error);
    return new Response(
      JSON.stringify({ error: "Erreur interne du serveur" }),
      { status: 500 }
    );
  }
}