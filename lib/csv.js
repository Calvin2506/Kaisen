const CSV_FIELDS = ["name", "amount", "currency", "billingCycle", "startDate", "category", "website", "notes", "status"]

function escapeCsv(value) {
  const text = value == null ? "" : value instanceof Date ? value.toISOString() : String(value)
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}

export function subscriptionsToCsv(subscriptions) {
  return [
    CSV_FIELDS.join(","),
    ...subscriptions.map((subscription) => CSV_FIELDS.map((field) => escapeCsv(subscription[field])).join(",")),
  ].join("\r\n")
}

export function parseCsv(text) {
  const rows = []
  let row = []
  let cell = ""
  let quoted = false

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index]
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        cell += '"'
        index += 1
      } else if (character === '"') {
        quoted = false
      } else {
        cell += character
      }
    } else if (character === '"' && cell.length === 0) {
      quoted = true
    } else if (character === ",") {
      row.push(cell)
      cell = ""
    } else if (character === "\n" || character === "\r") {
      if (character === "\r" && text[index + 1] === "\n") index += 1
      row.push(cell)
      if (row.some((value) => value.length > 0)) rows.push(row)
      row = []
      cell = ""
    } else {
      cell += character
    }
  }
  if (quoted) throw new Error("The CSV has an unclosed quoted value.")
  if (cell.length || row.length) {
    row.push(cell)
    if (row.some((value) => value.length > 0)) rows.push(row)
  }
  if (rows.length < 2) return []

  const headers = rows[0].map((header) => header.trim())
  const missing = CSV_FIELDS.filter((field) => !headers.includes(field))
  if (missing.length) throw new Error(`CSV is missing columns: ${missing.join(", ")}`)

  return rows.slice(1).map((values) => Object.fromEntries(
    CSV_FIELDS.map((field) => [field, values[headers.indexOf(field)] ?? ""]),
  ))
}
