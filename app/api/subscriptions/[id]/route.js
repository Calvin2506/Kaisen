import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import db from "@/lib/db"
import { calculateNextPayDate } from "@/lib/helpers"

// PUT update subscription
export async function PUT(req, { params }) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { name, amount, currency, billingCycle, startDate, category, notes, website, status } = body

    const nextPayDate = calculateNextPayDate(startDate, billingCycle)

    const subscription = await db.subscription.update({
      where: { id: params.id },
      data: {
        name,
        amount: parseFloat(amount),
        currency,
        billingCycle,
        startDate: new Date(startDate),
        nextPayDate,
        category,
        notes: notes || null,
        website: website || null,
        status,
      },
    })

    return NextResponse.json(subscription)
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

// DELETE subscription
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await db.subscription.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}