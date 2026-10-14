import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createSubscriptions } from "@/lib/db";
import { calculateNextPayDate } from "@/lib/helpers";
import { validateSubscriptionPayload } from "@/lib/subscription-validation";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { subscriptions } = await request.json();
    if (!Array.isArray(subscriptions) || subscriptions.length === 0 || subscriptions.length > 200) {
      return NextResponse.json({ error: "Import between 1 and 200 subscriptions at a time." }, { status: 400 });
    }

    const validated = subscriptions.map((subscription, index) => {
      const result = validateSubscriptionPayload(subscription);
      return result.error ? { error: `Row ${index + 2}: ${result.error}` } : { value: result.value };
    });
    const invalid = validated.find((result) => result.error);
    if (invalid) return NextResponse.json({ error: invalid.error }, { status: 400 });

    await createSubscriptions(validated.map(({ value }) => ({
      ...value,
      nextPayDate: calculateNextPayDate(value.startDate, value.billingCycle),
      userId: session.user.id,
    })));

    return NextResponse.json({ imported: validated.length }, { status: 201 });
  } catch (error) {
    console.error("POST /api/subscriptions/import error:", error);
    return NextResponse.json({ error: "Could not import subscriptions." }, { status: 500 });
  }
}
