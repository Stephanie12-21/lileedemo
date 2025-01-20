// import stripe from "@/lib/stripe";
// import { db } from "@/lib/db";
// import { NextResponse } from "next/server";

// export async function POST(request) {
//   const FEE = 0.12;
//   const formData = await request.formData();
//   const annonceId = formData.get("annonceId");
//   const priceId = formData.get("priceId");
//   const price = await stripe.prices.retrieve(priceId);
//   const buyerId = formData.get("buyerId");
//   const sellerId = formData.get("sellerId");
//   const seller = await db.user.findUnique({
//     where: { id: parseInt(sellerId, 10) },
//   });

//   const session = await stripe.checkout.sessions.create({
//     line_items: [
//       {
//         price: priceId,
//         quantity: 1,
//       },
//     ],
//     mode: "payment",
//     payment_intent_data: {
//       application_fee_amount: price.unit_amount * FEE,
//       on_behalf_of: seller.stripeAccountId,
//       transfer_data: {
//         destination: seller.stripeAccountId,
//       },
//     },
//     success_url: `${process.env.FRONTEND_URL}/Success`,
//   });

//   return NextResponse.json(
//     {
//       checkoutSession: session,
//     },
//     { status: 200 }
//   );
// }

//avec database okay données
// import stripe from "@/lib/stripe";
// import { db } from "@/lib/db"; // Vérifiez si db est bien initialisé
// import { NextResponse } from "next/server";

// export async function POST(request) {
//   const FEE = 0.12;

//   try {
//     const formData = await request.formData();
//     const annonceId = parseInt(formData.get("annonceId"), 10);
//     const priceId = formData.get("priceId");
//     const quantity = parseInt(formData.get("quantity"), 10) || 1;
//     const buyerId = parseInt(formData.get("buyerId"), 10);
//     const sellerId = parseInt(formData.get("sellerId"), 10);

//     // Vérification des données
//     if (!annonceId || !priceId || !buyerId || !sellerId) {
//       return NextResponse.json(
//         {
//           error:
//             "Données manquantes : annonceId, priceId, quantity, buyerId, sellerId sont nécessaires.",
//         },
//         { status: 400 }
//       );
//     }

//     //console.log("Récupération du prix Stripe pour priceId:", priceId);
//     const price = await stripe.prices.retrieve(priceId);
//     // console.log("Prix récupéré:", price);

//     // console.log(
//     //   "Récupération des informations du vendeur pour sellerId:",
//     //   sellerId
//     // );
//     const seller = await db.user.findUnique({
//       where: { id: sellerId },
//     });
//     // console.log("Vendeur récupéré:", seller);

//     if (!seller || !seller.stripeAccountId) {
//       return NextResponse.json(
//         { error: "Vendeur introuvable ou compte Stripe manquant" },
//         { status: 400 }
//       );
//     }

//     // console.log("Création de la session Stripe...");
//     const session = await stripe.checkout.sessions.create({
//       line_items: [
//         {
//           price: priceId,
//           quantity: quantity,
//         },
//       ],
//       mode: "payment",
//       payment_intent_data: {
//         application_fee_amount: Math.round(price.unit_amount * FEE * quantity),
//         on_behalf_of: seller.stripeAccountId,
//         transfer_data: {
//           destination: seller.stripeAccountId,
//         },
//         metadata: {
//           transactionId: transactionData.id, // Ajoutez l'ID de la transaction ici
//         },
//       },
//       success_url: `${process.env.FRONTEND_URL}/Success`,
//       cancel_url: `${process.env.FRONTEND_URL}/cancel`,
//     });

//     //console.log("Session Stripe créée:", session);

//     // Log des données qui seront enregistrées dans la base de données
//     const transactionData = {
//       annonceId: annonceId,
//       price: price.unit_amount / 100, // Convertir le prix en euros
//       quantity: quantity,
//       userId: buyerId,
//     };
//     console.log(
//       "Données de la transaction à enregistrer dans la base de données:",
//       transactionData
//     );

//     if (!db.transactions) {
//       console.error("Erreur: db.transactions est undefined.");
//       return NextResponse.json(
//         { error: "Erreur interne: Transactions non définies." },
//         { status: 500 }
//       );
//     }

//     console.log("Enregistrement de la transaction dans la base de données...");
//     // console.log("db.transactions:", db.transactions);

//     await db.transactions.create({
//       data: transactionData,
//     });

//     console.log("Transaction enregistrée.");

//     return NextResponse.json(
//       {
//         message: "Transaction initialisée.",
//         checkoutSession: session,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Erreur lors de la création de la transaction :", error);
//     return NextResponse.json(
//       { error: "Erreur lors de la création de la transaction." },
//       { status: 500 }
//     );
//   }
// }

import stripe from "@/lib/stripe";
import { db } from "@/lib/db"; // Vérifiez si db est bien initialisé
import { NextResponse } from "next/server";

export async function POST(request) {
  const FEE = 0.12;

  try {
    const formData = await request.formData();
    const annonceId = parseInt(formData.get("annonceId"), 10);
    const priceId = formData.get("priceId");
    const quantity = parseInt(formData.get("quantity"), 10) || 1;
    const buyerId = parseInt(formData.get("buyerId"), 10);
    const sellerId = parseInt(formData.get("sellerId"), 10);

    // Vérification des données
    if (!annonceId || !priceId || !buyerId || !sellerId) {
      return NextResponse.json(
        {
          error:
            "Données manquantes : annonceId, priceId, quantity, buyerId, sellerId sont nécessaires.",
        },
        { status: 400 }
      );
    }

    // Récupérer le prix Stripe pour priceId
    const price = await stripe.prices.retrieve(priceId);

    // Récupérer les informations du vendeur pour sellerId
    const seller = await db.user.findUnique({
      where: { id: sellerId },
    });

    if (!seller || !seller.stripeAccountId) {
      return NextResponse.json(
        { error: "Vendeur introuvable ou compte Stripe manquant" },
        { status: 400 }
      );
    }

    // Créer d'abord la transaction dans la base de données
    const transactionData = await db.transactions.create({
      data: {
        annonceId: annonceId,
        price: price.unit_amount / 100, // Convertir le prix en euros
        quantity: quantity,
        userId: buyerId,
      },
    });

    console.log("Transaction enregistrée avec l'ID:", transactionData.id);

    // Créer la session Stripe en utilisant l'ID de la transaction
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: quantity,
        },
      ],
      mode: "payment",
      payment_intent_data: {
        application_fee_amount: Math.round(price.unit_amount * FEE * quantity),
        on_behalf_of: seller.stripeAccountId,
        transfer_data: {
          destination: seller.stripeAccountId,
        },
        metadata: {
          transactionId: transactionData.id, // Utiliser l'ID de la transaction ici
        },
      },
      success_url: `${process.env.FRONTEND_URL}/Success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    return NextResponse.json(
      {
        message: "Transaction initialisée.",
        checkoutSession: session,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la création de la transaction :", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la transaction." },
      { status: 500 }
    );
  }
}
