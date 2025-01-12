import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(request){

    try {
    const body = await request.formData()
    const id = body.get('id')

    const annonce = await db.annonces.findUnique({
        where: {id: parseInt(id, 10)},
        include: {
            imageAnnonces: true,
        }
    })

    const product = await stripe.products.create({
        name: annonce.titre,
        description: annonce.description,
        images: annonce.imageAnnonces.slice(8).map(image => image.path),
        active: true,
        metadata: {
            categorie: annonce.categorieAnnonce,
            sousCategorie: annonce.sousCategorie,
            ownerId: annonce.userId
        },
    })

    const price = await stripe.prices.create({
        currency: 'EUR',
        product: product.id,
        unit_amount: annonce.prix * 100,

    })

    await db.annonces.update({
        where: {id: annonce.id},
        data: {
            priceId: price.id
        }
    });

    return NextResponse
            .json({
                    message: 'Product created successfuly',
                }, 
                {
                    status: 200
            })
        }
    catch(e) {
        return NextResponse.json({
            message: "OOOps, Unexcepted error while creating product and/or price stripe...",
            error: e
        }, {status: 500})
    }
}