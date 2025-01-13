import { db } from "@/lib/db";
import stripe from "@/lib/stripe";
import { where } from "firebase/firestore";
import { NextResponse } from "next/server";

export function GET(request){

}

export async function POST(request) {

    try  {
        const body = await request.formData();
        const userId = body.get('userId');
    
        const user = await db.user.findUnique({
        where: {id: parseInt(userId, 10)}
        })

        const account = await stripe.accounts.create({
            country: 'FR',
            email: user.email,
            controller: {
                fees: {
                    payer: 'application'
                },
                losses:  {
                    payments: 'application'
                },
                stripe_dashboard: {
                    type: 'express'
                },
            },
            capabilities: {
                transfers: {
                    requested: true,
                },
                card_payments: {
                    requested: true
                }
            },
            
            business_type: 'individual',
            individual: {
                email: user.email,
                first_name: user.prenom,
                last_name: user.last_name
            },
            metadata: {
                userId: user.id,
                userRole: user.role 
            },
            default_currency: 'eur'
        })

        await db.user.update({
        where: {id: user.id},
        data: {
            stripeAccountId: account.id
        }
        })

        return NextResponse.json(
            account,
            { status: 200 }
        )
    }
    catch(e){
        return NextResponse.json({
            message: "Unexcepted error while creating stripe account...",
            error: e
        }, 
        {
            status: 500
        })
    }
}