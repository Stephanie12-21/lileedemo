import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET(request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const prices = await stripe.prices.list({ limit: 10 });

  const pricesWithProducts = await Promise.all(
    prices.data.map(async (price) => {
      const product = await stripe.products.retrieve(price.product);
      return {
        ...price,
        nickname: product.name,
      };
    })
  );

  return NextResponse.json(pricesWithProducts.reverse());
}
