"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts"
import { getDaysUntilRenewal, formatCurrency } from "@/lib/helpers"
import { Card, CardContent, Badge, Button } from "@/components/ui"
import PageShell, { LoadingScreen } from "@/components/PageShell"

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#22c55e", "#eab308", "#06b6d4", "#ef4444", "#f97316"]

const TOOLTIP_STYLE = {
  background: "#1a1f2e",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "10px",
  color: "white",
  fontSize: "13px",
  fontFamily: "'DM Sans', sans-serif",
}

export default function Dashboard() {
  const { data: session } = useSession()
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const res = await fetch("/api/subscriptions")
        const data = await res.json()
        setSubscriptions(data)
      } catch (error) {
        console.error("Failed to fetch", error)
      } finally {
        setLoading(false)
      }
    }
    fetchSubscriptions()
  }, [])

  const activeSubscriptions = subscriptions.filter((s) => s.status === "active")

  const totalMonthly = activeSubscriptions.reduce((sum, sub) => {
    if (sub.billingCycle === "monthly") return sum + sub.amount
    if (sub.billingCycle === "yearly") return sum + sub.amount / 12
    return sum
  }, 0)

  const totalYearly = totalMonthly * 12

  const upcomingRenewals = activeSubscriptions
    .filter((sub) => getDaysUntilRenewal(sub.nextPayDate) <= 7)
    .sort((a, b) => new Date(a.nextPayDate) - new Date(b.nextPayDate))

  const categoryData = activeSubscriptions.reduce((acc, sub) => {
    const existing = acc.find((item) => item.name === sub.category)
    const monthlyAmount = sub.billingCycle === "monthly" ? sub.amount : sub.amount / 12
    if (existing) {
      existing.value += monthlyAmount
    } else {
      acc.push({ name: sub.category, value: monthlyAmount })
    }
    return acc
  }, []).sort((a, b) => b.value - a.value)

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const monthlyTrend = monthNames.map((month) => ({
    month,
    amount: parseFloat(totalMonthly.toFixed(2)),
  }))

  const stats = [
    {
      label: "Monthly Spend",
      value: formatCurrency(totalMonthly),
      sub: "across active subscriptions",
      accent: "#3b82f6",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Yearly Projection",
      value: formatCurrency(totalYearly),
      sub: "estimated annual cost",
      accent: "#8b5cf6",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: "Active Subscriptions",
      value: activeSubscriptions.length,
      sub: `${subscriptions.length} total tracked`,
      accent: "#22c55e",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      label: "Upcoming Renewals",
      value: upcomingRenewals.length,
      sub: "due in next 7 days",
      accent: upcomingRenewals.length > 0 ? "#f59e0b" : "#22c55e",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ]

  if (loading) {
    return <LoadingScreen label="Loading dashboard..." />
  }

  return (
    <PageShell>
        <div className="mb-10">
          <p className="text-blue-300/80 text-xs uppercase tracking-[0.2em] mb-2">Overview</p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl lg:text-4xl text-white tracking-tight">
                Good morning, {session?.user?.name?.split(" ")[0]}
              </h1>
              <p className="text-white/40 text-sm mt-2">
                Here’s what your subscriptions are doing today.
              </p>
            </div>
            <Link href="/subscriptions">
              <Button size="sm">Add subscription</Button>
            </Link>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={stat.label} className="p-5 animate-slide-up" style={{ animationDelay: `${index * 80}ms` }}>
              <p className="text-white/40 text-xs uppercase tracking-wider">{stat.label}</p>
              <p className="font-serif text-3xl text-white mt-3 tracking-tight">{stat.value}</p>
              <p className="text-white/30 text-xs mt-2">{stat.sub}</p>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-4 mb-8">
          {/* Pie Chart - Spend by Category */}
          <Card className="overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5">
              <div className="flex items-center justify-between">
                <h2 className="font-medium text-white">Spend by Category</h2>
                {categoryData.length > 0 && (
                  <Badge variant="neutral" className="text-xs">
                    {categoryData.length} categories
                  </Badge>
                )}
              </div>
            </div>
            <CardContent className="p-6 pt-4">
              {categoryData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <svg className="w-12 h-12 text-white/10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="text-white/30 text-sm">No subscriptions yet</p>
                  <Link href="/subscriptions" className="mt-3">
                    <Button size="sm">Add your first</Button>
                  </Link>
                </div>
              ) : (
                <>
                  <div className="h-[260px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={100}
                          paddingAngle={3}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {categoryData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [formatCurrency(value), "Monthly"]}
                          contentStyle={TOOLTIP_STYLE}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
                    {categoryData.map((entry, index) => (
                      <div key={entry.name} className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[index % COLORS.length] }} />
                        <span className="text-white/40 text-xs">{entry.name}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Bar Chart - Monthly Trend */}
          <Card className="overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5">
              <h2 className="font-medium text-white">Monthly Spend Trend</h2>
            </div>
            <CardContent className="p-6 pt-4">
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyTrend} barSize={20}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11, fontFamily: "'DM Sans', sans-serif" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11, fontFamily: "'DM Sans', sans-serif" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => formatCurrency(v).replace(/[^\d]/g, '')}
                    />
                    <Tooltip
                      formatter={(value) => [formatCurrency(value), "Monthly"]}
                      contentStyle={TOOLTIP_STYLE}
                      cursor={{ fill: "rgba(255,255,255,0.04)" }}
                    />
                    <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Renewals */}
        <Card>
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <h2 className="font-medium text-white">Upcoming Renewals</h2>
            <Link href="/subscriptions" className="text-sm text-blue-400 hover:text-blue-300 font-medium">
              View all →
            </Link>
          </div>
          <CardContent className="p-6 pt-0">
            {upcomingRenewals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <span className="text-4xl mb-3">🎉</span>
                <p className="text-white/30 text-sm">No renewals in the next 7 days</p>
                <p className="text-white/20 text-xs mt-1">You're all caught up!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingRenewals.map((sub) => {
                  const days = getDaysUntilRenewal(sub.nextPayDate)
                  const isUrgent = days <= 3
                  const isSoon = days <= 7

                  return (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between p-4 bg-white/3 border border-white/5 rounded-xl hover:border-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                          <span className="text-xl">💳</span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{sub.name}</p>
                          <p className="text-white/30 text-sm">{sub.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-right">
                        <div>
                          <p className="text-white font-bold text-lg">{formatCurrency(sub.amount, sub.currency)}</p>
                          <p className="text-white/30 text-xs">/{sub.billingCycle}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isUrgent ? "bg-red-400" : isSoon ? "bg-yellow-400" : "bg-green-400"
                            }`}
                          />
                          <span
                            className={`text-sm font-semibold ${
                              isUrgent ? "text-red-400" : isSoon ? "text-yellow-400" : "text-green-400"
                            }`}
                          >
                            {days === 0 ? "Due today" : days === 1 ? "Due tomorrow" : `${days} days left`}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
    </PageShell>
  )
}