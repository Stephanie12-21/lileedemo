import { db } from "@/lib/db"
import stripe from "@/lib/stripe"
import { NextResponse } from "next/server"

export async function POST(request) {
    const body = await request.formData()
    const name = body.get('name')
    const price = body.get('price')
    const description = body.get('description')

    const product = await stripe.products.create({
        name: name,
        description: description
    })

    const stripePrice = await stripe.prices.create({
        product: product.id,
        unit_amount: parseInt(parseFloat(price) * 100),
        currency: 'EUR',
        recurring: {
            interval: 'month'
        }
    })

    const plan = await db.plan.create({
        data: {
            name: name,
            price: parseFloat(parseFloat(price).toFixed(2)),
            description: description,
            priceId: stripePrice.id
        }
    })

    return NextResponse.json({
        message: 'success'
    }, { status: 200})
}