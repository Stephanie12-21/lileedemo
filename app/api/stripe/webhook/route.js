import stripe from "@/lib/stripe";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = request.headers.get("Stripe-Signature");
  const body = await request.text();

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    console.log("Événement Stripe reçu :", event.type);

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;

      // Récupérer transactionId depuis metadata et convertir en entier
      const transactionId = parseInt(paymentIntent.metadata.transactionId, 10);
      if (isNaN(transactionId)) {
        console.error(
          "transactionId non valide :",
          paymentIntent.metadata.transactionId
        );
        return NextResponse.json(
          { error: "transactionId non valide" },
          { status: 400 }
        );
      }

      // Mettre à jour la transaction dans la base de données
      await db.transactions.update({
        where: { id: transactionId },
        data: { status: "COMPLETED" },
      });

      console.log(`Transaction ${transactionId} mise à jour avec succès.`);
    } else {
      console.log(`Événement non pris en charge : ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error(
      "Erreur lors de la validation ou du traitement de l'événement :",
      err.message
    );
    return NextResponse.json(
      { error: "Erreur lors du traitement du webhook" },
      { status: 400 }
    );
  }
}
