import { db } from "@/lib/db"
import stripe from "@/lib/stripe"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { NextResponse } from "next/server"
import { v4 } from "uuid"

export async function POST(request){
    const formData = await request.formData()
    const planId = formData.get('planId')
    const session = await getServerSession(authOptions)

    const plan = await db.plan.findUnique({
        where: {id: parseInt(planId, 10)}
    })

    const authUser = await db.user.findUnique({
        where: {id: parseInt(session.user.id, 10)}
    })

    const checkout = await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [
            {
                price: plan.priceId,
                quantity: 1
            }
        ],
        customer: authUser.stripeCustomerId,
        success_url: `https://www.google.com`,
        cancel_url: `https://www.facebook.com`
    }, {
        idempotencyKey: v4()
    })
    

    return NextResponse.json(checkout, {status: 200})
}