import stripe from "@/lib/stripe";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  const FEE = 0.12;

  try {
    const formData = await request.formData();
    const fromDate = formData.get("from")
      ? new Date(formData.get("from"))
      : null;
    const toDate = formData.get("to") ? new Date(formData.get("to")) : null;

    const dateRange =
      fromDate && toDate ? { from: fromDate, to: toDate } : null;

    const annonceId = parseInt(formData.get("annonceId"), 10);
    const priceId = formData.get("priceId");
    const quantity = parseInt(formData.get("quantity"), 10) || 1;
    const buyerId = parseInt(formData.get("buyerId"), 10);
    const sellerId = parseInt(formData.get("sellerId"), 10);

    if (!annonceId || !priceId || !buyerId || !sellerId) {
      return NextResponse.json(
        {
          error:
            "Données manquantes : annonceId, priceId, buyerId et sellerId sont nécessaires.",
        },
        { status: 400 }
      );
    }

    const price = await stripe.prices.retrieve(priceId);

    const seller = await db.user.findUnique({
      where: { id: sellerId },
    });

    if (!seller || !seller.stripeAccountId) {
      return NextResponse.json(
        { error: "Vendeur introuvable ou compte Stripe manquant." },
        { status: 400 }
      );
    }

    const transactionData = await db.transactions.create({
      data: {
        dateRange, 
        annonceId,
        price: price.unit_amount / 100,
        quantity,
        userId: buyerId,
      },
    });

    console.log("Transaction enregistrée avec l'ID:", transactionData.id);

    // Création de la session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity,
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
          transactionId: transactionData.id,
        },
      },
      success_url: `${process.env.FRONTEND_URL}/Success`,
      cancel_url: `${process.env.FRONTEND_URL}/Cancel`,
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
