import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request) {
  try {
    const { annonceId, priceId } = await request.json();

    if (!annonceId || !priceId) {
      return new NextResponse("Données manquantes", { status: 400 });
    }

    let plan, periode, finDate;
    const debutDate = new Date();

    if (priceId === process.env.STRIPE_BADGE_URGENT_PRIX_ID) {
      plan = "URGENT";
      periode = "SEMAINE";
      finDate = new Date(debutDate.setDate(debutDate.getDate() + 7));
    } else if (priceId === process.env.STRIPE_BADGE_UNE_PREMIUM_PRIX_ID) {
      plan = "UNE";
      periode = "MOIS";
      finDate = new Date(debutDate.setMonth(debutDate.getMonth() + 1));
    } else if (priceId === process.env.STRIPE_BADGE_UNE_MEDIUM_PRIX_ID) {
      plan = "UNE";
      periode = "SEMAINE";
      finDate = new Date(debutDate.setMonth(debutDate.getMonth() + 1));
    } else if (priceId === process.env.STRIPE_BOOST_STANDARD_PRIX_ID) {
      plan = "RECOMMANDATION";
      periode = "SEMAINE";
      finDate = new Date(debutDate.setDate(debutDate.getDate() + 7));
    } else if (priceId === process.env.STRIPE_BOOST_PREMIUM_PRIX_ID) {
      plan = "RECOMMANDATION";
      periode = "SEMAINE";
      finDate = new Date(debutDate.setDate(debutDate.getDate() + 7));
    } else if (priceId === process.env.STRIPE_BOOST_MEDIUM_PRIX_ID) {
      plan = "RECOMMANDATION";
      periode = "MOIS";
      finDate = new Date(debutDate.setDate(debutDate.getDate() + 7));
    } else {
      return new NextResponse("Offre invalide", { status: 400 });
    }

    const boost = await db.boost.upsert({
      where: { annonceId: parseInt(annonceId) },
      update: { plan, periode, debutDate: new Date(), finDate },
      create: {
        annonceId: parseInt(annonceId),
        plan,
        periode,
        debutDate: new Date(),
        finDate,
      },
    });

    return NextResponse.json(boost);
  } catch (error) {
    console.error(error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}
