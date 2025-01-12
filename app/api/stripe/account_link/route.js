import stripe from "@/lib/stripe"
import { NextResponse } from "next/server"

export async function POST(request){
    try {
        const body = await request.formData()
        const accountId = body.get('accountId')
        const userId = body.get('userId')
        const role = body.get('role')

        const accountLink = await stripe.accountLinks.create({
            account: accountId,
            type: 'account_onboarding',
            return_url: `${process.env.FRONTEND_URL}/${role}/${userId}`,
            refresh_url: `${process.env.FRONTEND_URL}/${role}/${userId}`
        })

        return NextResponse.json(accountLink, { status: 200})
    }
    catch(e){
        return NextResponse.json({
            message: "Unexcepted error while creating account link...",
        }, { status: 500})
    }
}