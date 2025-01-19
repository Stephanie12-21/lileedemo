import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";

export async function GET(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.redirect(`${process.env.FRONTEND_URL}/login`);
  }
  await db.user.update({
    where: { id: parseInt(session.user.id, 10) },
    data: {
      stripeAccountCompleted: true,
    },
  });

  const paths = {
    PERSO: "personnel",
    PRO: "professionnel",
    ADMIN: "admin",
  };

  return NextResponse.redirect(
    `${process.env.FRONTEND_URL}/${paths[session.user.role]}/profile/${
      session.user.id
    }`
  );
}
