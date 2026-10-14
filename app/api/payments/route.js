import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPaymentsByUserId } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payments = await getPaymentsByUserId(session.user.id);
    return NextResponse.json(payments.map((payment) => ({
      ...payment,
      paidAt: payment.paidAt?.toDate?.().toISOString() || payment.paidAt?.toISOString?.() || payment.paidAt,
    })));
  } catch (error) {
    console.error("GET /api/payments error:", error);
    return NextResponse.json({ error: "Could not fetch payment history." }, { status: 500 });
  }
}
