import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import db from "@/lib/db"
import { calculateNextPayDate } from "@/lib/helpers"
import { validateSubscriptionPayload } from "@/lib/subscription-validation"

function serializeSubscription(subscription) {
  return Object.fromEntries(
    Object.entries(subscription).map(([key, value]) => [
      key,
      value && typeof value.toDate === "function"
        ? value.toDate().toISOString()
        : value instanceof Date
          ? value.toISOString()
          : value,
    ]),
  )
}

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

    return NextResponse.json(subscriptions.map(serializeSubscription))
  } catch (error) {
    console.error("GET /api/subscriptions error:", error)
    return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { value, error } = validateSubscriptionPayload(await req.json())
    if (error) return NextResponse.json({ error }, { status: 400 })
    const subscription = await db.subscription.create({
      data: {
        ...value,
        nextPayDate: calculateNextPayDate(value.startDate, value.billingCycle),
        userId: session.user.id,
      },
    })

    return NextResponse.json(serializeSubscription(subscription), { status: 201 })
  } catch (error) {
    console.error("POST /api/subscriptions error:", error)
    return NextResponse.json({ error: "Could not create subscription." }, { status: 500 })
  }
}
