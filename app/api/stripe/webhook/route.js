// import stripe from "@/lib/stripe";
// import { db } from "@/lib/db";

// export async function POST(request) {
//   const sig = request.headers.get("stripe-signature");

//   if (!sig) {
//     console.error("Signature Stripe manquante.");
//     return new Response("Signature manquante", { status: 400 });
//   }

//   const payload = await request.text();

//   try {
//     // Vérification de l'événement Stripe
//     const event = stripe.webhooks.constructEvent(
//       payload,
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );

//     console.log(`Événement Stripe reçu : ${event.type}`);

//     const handleSessionUpdate = async (session, status) => {
//       const { annonceId, buyerId } = session.metadata || {};

//       if (!annonceId || !buyerId) {
//         console.error("Métadonnées manquantes ou invalides.");
//         return new Response("Métadonnées invalides", { status: 400 });
//       }

//       const annonceIdInt = parseInt(annonceId, 10);
//       const buyerIdInt = parseInt(buyerId, 10);

//       await db.transactions.updateMany({
//         where: {
//           annonceId: annonceIdInt,
//           userId: buyerIdInt,
//           status: "PENDING",
//         },
//         data: {
//           status ,
//         },
//       });

//       console.log(
//         `Transaction mise à jour pour annonceId: ${annonceIdInt}, buyerId: ${buyerIdInt}, statut: ${status}`
//       );
//     };

//     // Gestion des différents types d'événements
//     switch (event.type) {
//       case "checkout.session.completed":
//         await handleSessionUpdate(event.data.object, "COMPLETED");
//         break;

//       case "payment_intent.payment_failed":
//         await handleSessionUpdate(event.data.object, "FAILED");
//         break;

//       default:
//         console.warn(`Événement non pris en charge : ${event.type}`);
//     }

//     return new Response("Webhook traité avec succès", { status: 200 });
//   } catch (error) {
//     if (error.message.includes("Timestamp outside the tolerance zone")) {
//       console.error(
//         "Erreur de synchronisation : L'horloge du serveur semble désynchronisée."
//       );
//       console.info(
//         "Assurez-vous que l'horloge du serveur est synchronisée avec un service NTP."
//       );
//     } else {
//       console.error("Erreur lors du traitement du webhook :", error.message);
//     }

//     return new Response("Erreur dans le webhook", { status: 400 });
//   }
// }
// import stripe from "@/lib/stripe";
// import { db } from "@/lib/db";
// import { NextResponse } from "next/server";

// export async function POST(request) {
//   const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
//   const sig = request.headers.get("Stripe-Signature");
//   const body = await request.text();

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
//     console.log("Événement Stripe reçu :", event.type);

//     if (event.type === "payment_intent.succeeded") {
//       const paymentIntent = event.data.object;

//       // Mettre à jour la transaction dans la base de données
//       const transactionId = paymentIntent.metadata.transactionId; // Assurez-vous que transactionId est bien défini dans le metadata
//       await db.transactions.update({
//         where: { id: transactionId },
//         data: { status: "COMPLETED" },
//       });

//       console.log(`Transaction ${transactionId} mise à jour avec succès.`);
//     } else {
//       console.log(`Événement non pris en charge : ${event.type}`);
//     }

//     return NextResponse.json({ received: true });
//   } catch (err) {
//     console.error(
//       "Erreur lors de la validation ou du traitement de l'événement :",
//       err.message
//     );
//     return NextResponse.json(
//       { error: "Erreur lors du traitement du webhook" },
//       { status: 400 }
//     );
//   }
// }

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
