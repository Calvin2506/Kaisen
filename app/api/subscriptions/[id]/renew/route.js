import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSubscriptionById, recordSubscriptionPayment } from "@/lib/db";
import { calculateNextPayDate } from "@/lib/helpers";

export async function POST(_request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const subscription = await getSubscriptionById(id, session.user.id);
    if (!subscription) return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    if (subscription.status !== "active") {
      return NextResponse.json({ error: "Only active subscriptions can be marked as paid." }, { status: 400 });
    }

    const renewalAnchor = subscription.nextPayDate || subscription.startDate;
    const nextPayDate = calculateNextPayDate(
      renewalAnchor?.toDate?.() || renewalAnchor,
      subscription.billingCycle,
    );
    if (!nextPayDate) return NextResponse.json({ error: "Could not calculate the next renewal date." }, { status: 400 });

    const payment = await recordSubscriptionPayment(id, session.user.id, nextPayDate);
    if (!payment) return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    return NextResponse.json({
      payment: {
        ...payment,
        paidAt: payment.paidAt.toISOString(),
        nextPayDate: payment.nextPayDate.toISOString(),
      },
    }, { status: 201 });
  } catch (error) {
    console.error("POST /api/subscriptions/[id]/renew error:", error);
    return NextResponse.json({ error: "Could not record payment." }, { status: 500 });
  }
}
