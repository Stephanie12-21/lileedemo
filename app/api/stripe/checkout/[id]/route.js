import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import stripe from "@/lib/stripe"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function GET(request, { params }){
    const checkout = await stripe.checkout.sessions.retrieve(params.id)
    const setupIntent = await stripe.setupIntents.retrieve(checkout.setup_intent)
    const session = await getServerSession(authOptions)
    const authUser = await db.user.findUnique({
        where: {id: parseInt(session.user.id, 10)}
    })    
    
    await stripe.paymentMethods.attach(setupIntent.payment_method, {
        customer: authUser.stripeCustomerId
    })

    await stripe.customers.update(authUser.stripeCustomerId, {
        invoice_settings: {
            default_payment_method: setupIntent.payment_method
        }
    })

    return NextResponse.redirect(`${process.env.FRONTEND_URL}`)
}