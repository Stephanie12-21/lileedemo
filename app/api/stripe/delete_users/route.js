import stripe from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function GET(){

    const { data } = await stripe.accounts.list({
        limit: 100
    })
    let deleted = 0
    for(let account of data){
        try {
            console.log('supperession de ', account.id)
            await stripe.accounts.del(account.id)
            deleted++
        }
        catch(e){;}
    }
    return NextResponse.json({
        deleted
    }, {status: 200})
}