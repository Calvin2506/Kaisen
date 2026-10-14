import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import db from "@/lib/db"
import { calculateNextPayDate } from "@/lib/helpers"
import { validateSubscriptionPayload } from "@/lib/subscription-validation"

export async function PUT(req, { params }) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { value, error } = validateSubscriptionPayload(await req.json())
    if (error) return NextResponse.json({ error }, { status: 400 })
    const nextPayDate = calculateNextPayDate(value.startDate, value.billingCycle)

    const updated = await db.subscription.updateMany({
      where: {
        id,
        userId: session.user.id,
      },
      data: {
        ...value,
        nextPayDate,
      },
    })

    if (updated.count === 0) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const deleted = await db.subscription.deleteMany({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (deleted.count === 0) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
