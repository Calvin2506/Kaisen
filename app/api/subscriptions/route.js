import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import db from "@/lib/db"
import { calculateNextPayDate } from "@/lib/helpers"

// GET all subscriptions for logged in user
export async function GET(req) {
  try {
    const session = await getServerSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
    })

    const subscriptions = await db.subscription.findMany({
      where: { userId: user.id },
      orderBy: { nextPayDate: "asc" },
    })

    return NextResponse.json(subscriptions)
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

// POST create new subscription
export async function POST(req) {
  try {
    const session = await getServerSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
    })

    const body = await req.json()
    const { name, amount, currency, billingCycle, startDate, category, notes, website } = body

    if (!name || !amount || !billingCycle || !startDate || !category) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 })
    }

    const nextPayDate = calculateNextPayDate(startDate, billingCycle)

    const subscription = await db.subscription.create({
      data: {
        name,
        amount: parseFloat(amount),
        currency: currency || "INR",
        billingCycle,
        startDate: new Date(startDate),
        nextPayDate,
        category,
        notes: notes || null,
        website: website || null,
        userId: user.id,
      },
    })

    return NextResponse.json(subscription, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}