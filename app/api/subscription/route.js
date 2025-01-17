import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request){
    const plans = await db.plan.findMany()
    return NextResponse.json(plans, { status: 200 })
}