export function calculateNextPayDate(startDate, billingCycle) {
  const start = new Date(startDate)
  const today = new Date()
  let next = new Date(start)

  if (billingCycle === "monthly") {
    // keep adding 1 month until next date is in the future
    while (next <= today) {
      next.setMonth(next.getMonth() + 1)
    }
  } else if (billingCycle === "yearly") {
    // keep adding 1 year until next date is in the future
    while (next <= today) {
      next.setFullYear(next.getFullYear() + 1)
    }
  }

  return next
}

export function getDaysUntilRenewal(nextPayDate) {
  const today = new Date()
  const next = new Date(nextPayDate)
  const diff = next - today
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function formatCurrency(amount, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
  }).format(amount)
}