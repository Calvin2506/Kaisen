import { getDaysUntilRenewal, formatCurrency } from "@/lib/helpers"

const CATEGORY_COLORS = {
  Entertainment: "bg-purple-500/20 text-purple-400",
  Music: "bg-pink-500/20 text-pink-400",
  Productivity: "bg-blue-500/20 text-blue-400",
  "Health & Fitness": "bg-green-500/20 text-green-400",
  Education: "bg-yellow-500/20 text-yellow-400",
  "Cloud Storage": "bg-cyan-500/20 text-cyan-400",
  Gaming: "bg-red-500/20 text-red-400",
  News: "bg-orange-500/20 text-orange-400",
  Shopping: "bg-indigo-500/20 text-indigo-400",
  Other: "bg-gray-500/20 text-gray-400",
}

export default function SubscriptionCard({ subscription, onEdit, onDelete }) {
  const daysUntil = getDaysUntilRenewal(subscription.nextPayDate)
  const categoryColor = CATEGORY_COLORS[subscription.category] || CATEGORY_COLORS.Other

  const renewalColor =
    daysUntil <= 3
      ? "text-red-400"
      : daysUntil <= 7
      ? "text-yellow-400"
      : "text-green-400"

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors">
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold text-lg">{subscription.name}</h3>
          <span className={`text-xs px-2 py-1 rounded-full ${categoryColor}`}>
            {subscription.category}
          </span>
        </div>
        <div className="text-right">
          <p className="text-white font-bold text-xl">
            {formatCurrency(subscription.amount, subscription.currency)}
          </p>
          <p className="text-gray-400 text-sm">/{subscription.billingCycle}</p>
        </div>
      </div>

      {/* Renewal Info */}
      <div className="bg-gray-800 rounded-lg p-3 mb-4">
        <p className="text-gray-400 text-sm">Next payment</p>
        <p className="text-white text-sm font-medium">
          {new Date(subscription.nextPayDate).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        <p className={`text-sm font-semibold ${renewalColor}`}>
          {daysUntil === 0
            ? "Due today!"
            : daysUntil === 1
            ? "Due tomorrow!"
            : `${daysUntil} days left`}
        </p>
      </div>

      {/* Status */}
      <div className="flex items-center justify-between mb-4">
        <span
          className={`text-xs px-3 py-1 rounded-full font-medium ${
            subscription.status === "active"
              ? "bg-green-500/20 text-green-400"
              : subscription.status === "paused"
              ? "bg-yellow-500/20 text-yellow-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {subscription.status}
        </span>
        {subscription.website && (
          <a
            href={subscription.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            Visit site →
          </a>
        )}
      </div>

      {/* Notes */}
      {subscription.notes && (
        <p className="text-gray-500 text-sm mb-4 italic">{subscription.notes}</p>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(subscription)}
          className="flex-1 bg-gray-800 hover:bg-gray-700 text-white text-sm py-2 rounded-lg transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(subscription.id)}
          className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm py-2 rounded-lg transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  )
}