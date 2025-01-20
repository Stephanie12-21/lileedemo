// import { db } from "@/lib/db";
// import { NextResponse } from "next/server";

// export async function GET(req, { params }) {
//   const { id: transactionId } = params; // Récupérer l'ID de la transaction depuis les paramètres d'URL

//   if (!transactionId) {
//     return NextResponse.json(
//       { message: "Transaction ID manquant" },
//       { status: 400 }
//     );
//   }

//   try {
//     const transaction = await db.transactions.findUnique({
//       where: {
//         id: Number(transactionId),
//       },
//       include: {
//         annonce: {
//           select: {
//             userId: true,
//           },
//         },
//         user: {
//           select: {
//             id: true,
//           },
//         },
//       },
//     });

//     if (!transaction) {
//       return NextResponse.json(
//         { message: "Transaction non trouvée" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       {
//         annonceUserId: transaction.annonce.userId,
//         buyerUserId: transaction.user.id,
//         transactionStatus: transaction.status,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Erreur lors de la récupération de la transaction :", error);
//     return NextResponse.json(
//       { message: "Erreur interne du serveur" },
//       { status: 500 }
//     );
//   }
// }
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { id: transactionId } = params; // Récupérer l'ID de la transaction depuis les paramètres d'URL

  if (!transactionId) {
    return NextResponse.json(
      { message: "Transaction ID manquant" },
      { status: 400 }
    );
  }

  try {
    const transaction = await db.transactions.findUnique({
      where: {
        id: Number(transactionId),
      },
      include: {
        annonce: {
          select: {
            userId: true,
          },
        },
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { message: "Transaction non trouvée" },
        { status: 404 }
      );
    }

    // Formatage de la date
    const createdAt = new Date(transaction.createdAt);
    const formattedDate = `${createdAt.getDate().toString().padStart(2, "0")}${(
      createdAt.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}${createdAt.getFullYear()}`;

    return NextResponse.json(
      {
        annonceUserId: transaction.annonce.userId,
        buyerUserId: transaction.user.id,
        transactionStatus: transaction.status,
        transactionDate: formattedDate, // Ajouter la date formatée
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la récupération de la transaction :", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
