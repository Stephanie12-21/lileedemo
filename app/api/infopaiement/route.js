import { db } from "@/lib/db";

export async function POST(req) {
  const { cardNumber, cardExpiry, cardCVC, nameOnCard, userId } =
    await req.json();

  if (!cardNumber || !cardExpiry || !cardCVC || !nameOnCard || !userId) {
    return new Response(
      JSON.stringify({ message: "Tous les champs sont obligatoires" }),
      { status: 400 }
    );
  }

  if (!/^\d{16}$/.test(cardNumber)) {
    return new Response(
      JSON.stringify({
        message: "Le numéro de carte doit contenir exactement 16 chiffres.",
      }),
      { status: 400 }
    );
  }

  const [expiryMonth, expiryYear] = cardExpiry
    .split("/")
    .map((part) => parseInt(part.trim(), 10));

  if (
    !expiryMonth ||
    !expiryYear ||
    expiryMonth < 1 ||
    expiryMonth > 12 ||
    isNaN(expiryMonth) ||
    isNaN(expiryYear)
  ) {
    return new Response(
      JSON.stringify({ message: "Date d'expiration invalide" }),
      { status: 400 }
    );
  }

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear() % 100;

  if (
    expiryYear < currentYear ||
    (expiryYear === currentYear && expiryMonth < currentMonth)
  ) {
    return new Response(
      JSON.stringify({
        message: "La date d'expiration est antérieure à la date actuelle.",
      }),
      { status: 400 }
    );
  }

  if (!/^\d{3}$/.test(cardCVC)) {
    return new Response(
      JSON.stringify({
        message: "Le CVC doit contenir exactement 3 chiffres.",
      }),
      { status: 400 }
    );
  }

  try {
    const newPaymentMethod = await db.moyenpaiement.create({
      data: {
        userId: parseInt(userId),
        cardNumber,
        cardCVC: parseInt(cardCVC),
        nameOnCard,
        cardExpiry: new Date(`20${expiryYear}-${expiryMonth}-01`),
      },
    });

    return new Response(
      JSON.stringify({
        message: "Moyen de paiement ajouté avec succès",
        paymentMethod: newPaymentMethod,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de l'ajout du moyen de paiement :", error);
    return new Response(
      JSON.stringify({
        message: "Erreur lors de l'ajout du moyen de paiement",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
