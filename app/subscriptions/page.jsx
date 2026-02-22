"use client"

import { useState } from "react"

const CATEGORIES = [
  "Entertainment", "Music", "Productivity", "Health & Fitness",
  "Education", "Cloud Storage", "Gaming", "News", "Shopping", "Other",
]

const formStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
  .form-input {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    color: white;
    padding: 11px 14px;
    border-radius: 10px;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: border-color 0.2s ease, background 0.2s ease;
    box-sizing: border-box;
    appearance: none;
  }
  .form-input::placeholder { color: rgba(255,255,255,0.2); }
  .form-input:focus {
    border-color: rgba(59,130,246,0.5);
    background: rgba(255,255,255,0.06);
  }
  .form-input option { background: #1a1f2e; color: white; }
  .form-label {
    display: block;
    color: rgb(255, 255, 255);
    font-size: 12px;
    font-weight: 500;
    margin-bottom: 7px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .btn-submit {
    flex: 1;
    background: linear-gradient(135deg, #2563eb, #4f46e5);
    color: white;
    border: none;
    padding: 12px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: opacity 0.2s ease;
  }
  .btn-submit:hover { opacity: 0.9; }
  .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-cancel {
    flex: 1;
    background: rgba(255,255,255,0.04);
    color: rgb(246, 242, 242);
    border: 1px solid rgba(255,255,255,0.1);
    padding: 12px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: background 0.2s ease;
  }
  .btn-cancel:hover { background: rgba(255,255,255,0.08); }
`

export default function SubscriptionForm({ onSubmit, initialData, onCancel }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    amount: initialData?.amount || "",
    currency: initialData?.currency || "INR",
    billingCycle: initialData?.billingCycle || "monthly",
    startDate: initialData?.startDate
      ? new Date(initialData.startDate).toISOString().split("T")[0]
      : "",
    category: initialData?.category || "",
    website: initialData?.website || "",
    notes: initialData?.notes || "",
    status: initialData?.status || "active",
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await onSubmit(formData)
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{formStyles}</style>

      {/* Name + Amount */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <div>
          <label className="form-label">App Name *</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange}
            placeholder="Netflix" required className="form-input" />
        </div>
        <div>
          <label className="form-label">Amount *</label>
          <input type="number" name="amount" value={formData.amount} onChange={handleChange}
            placeholder="649" required className="form-input" />
        </div>
      </div>

      {/* Currency + Billing Cycle */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <div>
          <label className="form-label">Currency</label>
          <select name="currency" value={formData.currency} onChange={handleChange} className="form-input">
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </div>
        <div>
          <label className="form-label">Billing Cycle *</label>
          <select name="billingCycle" value={formData.billingCycle} onChange={handleChange} className="form-input">
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

      {/* Category + Start Date */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <div>
          <label className="form-label">Category *</label>
          <select name="category" value={formData.category} onChange={handleChange} required className="form-input">
            <option value="">Select category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label">Start Date *</label>
          <input type="date" name="startDate" value={formData.startDate} onChange={handleChange}
            required className="form-input" style={{ colorScheme: "dark" }} />
        </div>
      </div>

      {/* Website */}
      <div>
        <label className="form-label">Website (optional)</label>
        <input type="url" name="website" value={formData.website} onChange={handleChange}
          placeholder="https://netflix.com" className="form-input" />
      </div>

      {/* Notes */}
      <div>
        <label className="form-label">Notes (optional)</label>
        <textarea name="notes" value={formData.notes} onChange={handleChange}
          placeholder="Family plan, shared with 3 people..." rows={3}
          className="form-input" style={{ resize: "none" }} />
      </div>

      {/* Status (edit only) */}
      {initialData && (
        <div>
          <label className="form-label">Status</label>
          <select name="status" value={formData.status} onChange={handleChange} className="form-input">
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      )}

      {/* Buttons */}
      <div style={{ display: "flex", gap: "10px", paddingTop: "4px" }}>
        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? "Saving..." : initialData ? "Update Subscription" : "Add Subscription"}
        </button>
        <button type="button" onClick={onCancel} className="btn-cancel">
          Cancel
        </button>
      </div>
    </form>
  )
}