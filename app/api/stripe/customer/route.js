import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import stripe from "@/lib/stripe";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(){
    const session = await getServerSession(authOptions)

    const customer = await stripe.customers.create({
        name: session.user.name,
        email: session.user.email,
    })

    await db.user.update({
        where: {id: parseInt(session.user.id, 10)},
        data: {
            stripeCustomerId: customer.id
        }
    })
    const checkout = await stripe.checkout.sessions.create({
        mode: 'setup',
        currency: 'EUR',
        customer: customer.id,
        success_url: `${process.env.FRONTEND_URL}/api/stripe/checkout/{CHECKOUT_SESSION_ID}`,
    })

    return NextResponse.json(checkout, {status: 200})
}