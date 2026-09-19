import { formatCurrency, getDaysUntilRenewal } from "@/lib/helpers"

export default function SubscriptionCard({ subscription, onEdit, onDelete }) {
  const daysLeft = getDaysUntilRenewal(subscription.nextPayDate)

  const urgencyColor =
    daysLeft <= 3
      ? "text-red-400"
      : daysLeft <= 7
      ? "text-yellow-400"
      : "text-green-400"

  const urgencyDot =
    daysLeft <= 3
      ? "bg-red-400"
      : daysLeft <= 7
      ? "bg-yellow-400"
      : "bg-green-400"

  return (
    <div className="
      group
      bg-[#13161f] border border-white/8
      rounded-2xl p-5
      flex flex-col gap-4
      hover:border-white/20 hover:bg-[#161925]
      transition-all duration-200
    ">

      {/* ── TOP ROW: Name + Amount ─────────────────────── */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <h3 className="text-white font-semibold text-base leading-tight">
            {subscription.name}
          </h3>
          <span className="
            self-start text-xs px-2.5 py-0.5
            bg-blue-500/15 text-blue-400
            border border-blue-500/20
            rounded-full
          ">
            {subscription.category}
          </span>
        </div>

        <div className="text-right shrink-0 ml-3">
          <p className="text-white font-bold text-lg leading-tight">
            {formatCurrency(subscription.amount, subscription.currency)}
          </p>
          <p className="text-[#6b7280] text-xs mt-0.5">
            /{subscription.billingCycle}
          </p>
        </div>
      </div>

      {/* ── RENEWAL SECTION ────────────────────────────── */}
      <div className="bg-white/[0.04] border border-white/5 rounded-xl px-4 py-3 flex flex-col gap-1">
        <p className="text-[#6b7280] text-xs uppercase tracking-wide">
          Next Payment
        </p>
        <p className="text-white text-sm font-medium">
          {new Date(subscription.nextPayDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className={`w-1.5 h-1.5 rounded-full ${urgencyDot}`} />
          <p className={`text-xs font-semibold ${urgencyColor}`}>
            {daysLeft === 0 ? "Due today" : `${daysLeft} days left`}
          </p>
        </div>
      </div>

      {/* ── ACTION BUTTONS ─────────────────────────────── */}
      <div className="flex gap-2 mt-auto">
        <button
          onClick={() => onEdit(subscription)}
          className="
            flex-1 text-sm py-2 rounded-lg font-medium
            bg-white/5 hover:bg-white/10
            text-[#d1d5db] hover:text-white
            border border-white/5 hover:border-white/10
            transition-all duration-150
          "
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(subscription.id)}
          className="
            flex-1 text-sm py-2 rounded-lg font-medium
            bg-red-500/10 hover:bg-red-500/20
            text-red-400 hover:text-red-300
            border border-red-500/10 hover:border-red-500/20
            transition-all duration-150
          "
        >
          Delete
        </button>
      </div>
    </div>
  )
}