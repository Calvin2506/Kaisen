"use client"

import { useState } from "react"

const CATEGORIES = [
  "Entertainment",
  "Music",
  "Productivity",
  "Health & Fitness",
  "Education",
  "Cloud Storage",
  "Gaming",
  "News",
  "Shopping",
  "Other",
]

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
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name and Amount */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-400 text-sm mb-2">App Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Netflix"
            required
            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-2">Amount *</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="649"
            required
            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Currency and Billing Cycle */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-400 text-sm mb-2">Currency</label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
          >
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-2">Billing Cycle *</label>
          <select
            name="billingCycle"
            value={formData.billingCycle}
            onChange={handleChange}
            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

      {/* Category and Start Date */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-400 text-sm mb-2">Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
          >
            <option value="">Select category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-2">Start Date *</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Website */}
      <div>
        <label className="block text-gray-400 text-sm mb-2">Website (optional)</label>
        <input
          type="url"
          name="website"
          value={formData.website}
          onChange={handleChange}
          placeholder="https://netflix.com"
          className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-gray-400 text-sm mb-2">Notes (optional)</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Family plan, shared with 3 people..."
          rows={3}
          className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 resize-none"
        />
      </div>

      {/* Status (only show when editing) */}
      {initialData && (
        <div>
          <label className="block text-gray-400 text-sm mb-2">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
          >
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "Saving..." : initialData ? "Update Subscription" : "Add Subscription"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}