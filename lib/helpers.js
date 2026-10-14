export function calculateNextPayDate(startDate, billingCycle) {
  const start = new Date(startDate)
  if (isNaN(start.getTime())) return null

  const intervalMonths = billingCycle === "monthly" ? 1 : billingCycle === "yearly" ? 12 : 0
  if (!intervalMonths) return null

  const today = new Date()
  const monthsSinceStart =
    (today.getFullYear() - start.getFullYear()) * 12 + today.getMonth() - start.getMonth()
  let intervals = Math.max(0, Math.floor(monthsSinceStart / intervalMonths))

  const createOccurrence = (count) => {
    const monthIndex = start.getMonth() + count * intervalMonths
    const year = start.getFullYear() + Math.floor(monthIndex / 12)
    const month = monthIndex % 12
    const day = Math.min(start.getDate(), new Date(year, month + 1, 0).getDate())
    return new Date(year, month, day, start.getHours(), start.getMinutes(), start.getSeconds(), start.getMilliseconds())
  }

  let next = createOccurrence(intervals)
  while (next <= today) next = createOccurrence(++intervals)
  return next
}

export function getDaysUntilRenewal(nextPayDate) {
  if (!nextPayDate) return null
  const today = new Date()
  const next = new Date(nextPayDate)
  if (isNaN(next.getTime())) return null
  const diff = new Date(next.getFullYear(), next.getMonth(), next.getDate()) -
    new Date(today.getFullYear(), today.getMonth(), today.getDate())
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function getRenewalLabel(daysUntilRenewal) {
  if (daysUntilRenewal === null || daysUntilRenewal === undefined) return "Unknown"
  if (daysUntilRenewal < 0) return "Expired"
  if (daysUntilRenewal === 0) return "Due today"
  return `${daysUntilRenewal} ${daysUntilRenewal === 1 ? "day" : "days"} left`
}

export function monthlyAmount(subscription) {
  const amount = Number(subscription.amount) || 0
  return subscription.billingCycle === "yearly" ? amount / 12 : amount
}

export function spendByCurrency(subscriptions) {
  return subscriptions.reduce((totals, subscription) => {
    const currency = subscription.currency || "INR"
    totals[currency] = (totals[currency] || 0) + monthlyAmount(subscription)
    return totals
  }, {})
}

export function formatCurrencyGroups(totals) {
  const entries = Object.entries(totals).filter(([, amount]) => amount > 0)
  if (!entries.length) return formatCurrency(0)
  return entries
    .sort(([first], [second]) => first.localeCompare(second))
    .map(([currency, amount]) => formatCurrency(amount, currency))
    .join(" · ")
}

export function formatCurrency(amount, currency = "INR") {
  const value = Number(amount) || 0
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "INR" ? 0 : 2,
    minimumFractionDigits: currency === "INR" ? 0 : 2,
  }).format(value)
}
