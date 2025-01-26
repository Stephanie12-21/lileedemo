// import { db } from "@/lib/db";
// import { NextResponse } from "next/server";

// export async function GET(req, { params }) {
//   const { id: transactionId } = params;

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

//     // Formatage de la date
//     const createdAt = new Date(transaction.createdAt);
//     const formattedDate = `${createdAt.getDate().toString().padStart(2, "0")}${(
//       createdAt.getMonth() + 1
//     )
//       .toString()
//       .padStart(2, "0")}${createdAt.getFullYear()}`;

//     return NextResponse.json(
//       {
//         annonceUserId: transaction.annonce.userId,
//         buyerUserId: transaction.user.id,
//         transactionStatus: transaction.status,
//         transactionDate: formattedDate, // Ajouter la date formatée
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
import { id } from "date-fns/locale";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { id: transactionId } = params;

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
            id: true,
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

    // Formatage de la date de création
    const createdAt = new Date(transaction.createdAt);
    const formattedDate = `${createdAt
      .getDate()
      .toString()
      .padStart(2, "0")}/${(createdAt.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${createdAt.getFullYear()}`;

    // Si 'from' et 'to' existent, on les formatte en une plage de dates (daterange)
    const fromDate = transaction.dateRange?.from
      ? new Date(transaction.dateRange.from)
      : null;
    const toDate = transaction.dateRange?.to
      ? new Date(transaction.dateRange.to)
      : null;

    const dateRange =
      fromDate && toDate
        ? `${fromDate.toLocaleDateString()} - ${toDate.toLocaleDateString()}`
        : fromDate
        ? `À partir de : ${fromDate.toLocaleDateString()}`
        : toDate
        ? `Jusqu&apos;à : ${toDate.toLocaleDateString()}`
        : "Aucune date";

    return NextResponse.json(
      {
        annonceUserId: transaction.annonce.userId,
        buyerUserId: transaction.user.id,
        transactionStatus: transaction.status,
        transactionDate: formattedDate,
        annonceId: transaction.annonce.id,
        dateRange,
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
