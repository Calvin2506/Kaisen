import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import db from "@/lib/db"
import { calculateNextPayDate } from "@/lib/helpers"

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const nextPayDate = calculateNextPayDate(body.startDate, body.billingCycle)

    const updated = await db.subscription.updateMany({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      data: {
        ...body,
        amount: parseFloat(body.amount),
        startDate: new Date(body.startDate),
        nextPayDate,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await db.subscription.deleteMany({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}