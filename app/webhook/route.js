import { db } from "@/lib/db"
import stripe from "@/lib/stripe"
import { NextResponse } from "next/server"

const endpoint_secret = process.env.WEBHOOK_STRIPE_SECRET
export async function POST(request){
    const signature = request.headers.get('stripe-signature')

    let stripeEvent
    try {
        stripeEvent = stripe.webhooks.constructEvent(await request.text(), signature, endpoint_secret)
    }   
    catch(e){ console.log(e); return NextResponse.json({mesage: "Invalid webhook signature"}, { status: 400}) }

    if(stripeEvent.type === "invoice.payment_succeeded"){
        const object = stripeEvent.data.object
        switch(object.billing_reason){
            case 'subscription_create': updateUserSubscription(object.customer, object.subscription)
        }
    }
    return NextResponse.json({
        receveid: true
    }, { status: 200})
}

const updateUserSubscription = async ( customerId, subscriptionId ) => {
    try {
        const subscription =  await stripe.subscriptions.retrieve(subscriptionId)
        const plans = await db.plan.findMany({
            where: {priceId: subscription.plan.id}
        })

        const plan = plans[0]

        await db.user.updateMany({
            where: {stripeCustomerId: customerId},
            data: {
                planId: plan.id
            }
        })

        return true
    }
    catch(e){
        console.log('error', e)
        return false
    }
}