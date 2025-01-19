import stripe from "@/lib/stripe";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  const FEE = 0.1; // a changer plus tard
  const formData = await request.formData();
  const priceId = formData.get("priceId");
  const price = await stripe.prices.retrieve(priceId);
  const buyerId = formData.get("buyerId");
  const sellerId = formData.get("sellerId");
  const seller = await db.user.findUnique({
    where: { id: parseInt(sellerId, 10) },
  });

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "payment",
    payment_intent_data: {
      application_fee_amount: price.unit_amount * FEE,
      on_behalf_of: seller.stripeAccountId,
      transfer_data: {
        destination: seller.stripeAccountId,
      },
    },
    success_url: `${process.env.FRONTEND_URL}/Success`,
  });

  return NextResponse.json(
    {
      checkoutSession: session,
    },
    { status: 200 }
  );
}
