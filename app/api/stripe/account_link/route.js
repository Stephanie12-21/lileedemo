import { db } from "@/lib/db"
import stripe from "@/lib/stripe"
import { NextResponse } from "next/server"

export async function POST(request){
    try {
        const body = await request.formData()
        const  userId = body.get('userId')

        if(! userId){
            return NextResponse.json({
                message: 'Invalid request',
            }, {status: 500})
        }

        const user = await db.user.findUnique({
            where: {id: parseInt(userId, 10)}
        })

        const accountLink = await stripe.accountLinks.create({
            account: user.stripeAccountId,
            type: 'account_onboarding',
            return_url: `${process.env.FRONTEND_URL}/api/stripe/account_completed`,
            refresh_url: `${process.env.FRONTEND_URL}/${user.role}/${userId}`,
            collection_options: {
                fields: "eventually_due",
                future_requirements: "include"
            }

        })

        return NextResponse.json(accountLink, { status: 200})
    }
    catch(e){
        return NextResponse.json({
            message: "Unexcepted error while creating account link...",
        }, { status: 500})
    }
}