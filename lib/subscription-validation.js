const CURRENCIES = new Set(["INR", "USD", "EUR", "GBP"])
const BILLING_CYCLES = new Set(["monthly", "yearly"])
const STATUSES = new Set(["active", "paused", "cancelled"])

export function validateSubscriptionPayload(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Provide subscription details." }
  }

  const name = typeof body.name === "string" ? body.name.trim() : ""
  const category = typeof body.category === "string" ? body.category.trim() : ""
  const amount = Number(body.amount)
  const startDate = new Date(body.startDate)
  const currency = body.currency || "INR"
  const billingCycle = body.billingCycle
  const status = body.status || "active"

  if (!name || name.length > 100) return { error: "Name is required and must be under 100 characters." }
  if (!Number.isFinite(amount) || amount <= 0 || amount > 1_000_000_000) {
    return { error: "Amount must be a positive number." }
  }
  if (!CURRENCIES.has(currency)) return { error: "Choose a supported currency." }
  if (!BILLING_CYCLES.has(billingCycle)) return { error: "Choose a monthly or yearly billing cycle." }
  if (!category || category.length > 60) return { error: "Category is required." }
  if (Number.isNaN(startDate.getTime())) return { error: "Enter a valid start date." }
  if (!STATUSES.has(status)) return { error: "Choose a valid subscription status." }

  return {
    value: {
      name,
      amount,
      currency,
      billingCycle,
      startDate,
      category,
      website: typeof body.website === "string" ? body.website.trim().slice(0, 500) : "",
      notes: typeof body.notes === "string" ? body.notes.trim().slice(0, 2000) : "",
      status,
    },
  }
}
