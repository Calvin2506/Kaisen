import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import db from "@/lib/db"
import { calculateNextPayDate } from "@/lib/helpers"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const subscriptions = await db.subscription.findMany({
      where: { userId: session.user.id },
      orderBy: { nextPayDate: "asc" },
    })

    return NextResponse.json(subscriptions)
  } catch (error) {
    console.error("GET /api/subscriptions error:", error)
    return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 })
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const nextPayDate = calculateNextPayDate(body.startDate, body.billingCycle)

  const subscription = await db.subscription.create({
    data: {
      ...body,
      amount: parseFloat(body.amount),
      startDate: new Date(body.startDate),
      nextPayDate,
      userId: session.user.id,
    },
  })

  return NextResponse.json(subscription)
}