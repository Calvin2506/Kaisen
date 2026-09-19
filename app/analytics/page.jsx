"use client"

import { useState, useEffect } from "react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts"
import { formatCurrency } from "@/lib/helpers"
import { Card, CardContent } from "@/components/ui"
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

export default function Analytics() {
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch("/api/subscriptions")
        const data = await res.json()
        setSubscriptions(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetch_()
  }, [])

  const active = subscriptions.filter((s) => s.status === "active")

  const totalMonthly = active.reduce((sum, sub) => {
    return sum + (sub.billingCycle === "monthly" ? sub.amount : sub.amount / 12)
  }, 0)

  const categoryData = active.reduce((acc, sub) => {
    const existing = acc.find((i) => i.name === sub.category)
    const monthly = sub.billingCycle === "monthly" ? sub.amount : sub.amount / 12
    if (existing) { existing.value += monthly; existing.count += 1 }
    else acc.push({ name: sub.category, value: monthly, count: 1 })
    return acc
  }, []).sort((a, b) => b.value - a.value)

  const billingData = [
    { name: "Monthly", value: active.filter((s) => s.billingCycle === "monthly").length },
    { name: "Yearly", value: active.filter((s) => s.billingCycle === "yearly").length },
  ]

  const mostExpensive = [...active]
    .sort((a, b) => {
      const aM = a.billingCycle === "monthly" ? a.amount : a.amount / 12
      const bM = b.billingCycle === "monthly" ? b.amount : b.amount / 12
      return bM - aM
    })
    .slice(0, 5)

  if (loading) {
    return <LoadingScreen label="Loading analytics..." />
  }

  const summaryStats = [
    { label: "Monthly Spend", value: formatCurrency(totalMonthly), accent: "#3b82f6" },
    { label: "Yearly Spend", value: formatCurrency(totalMonthly * 12), accent: "#8b5cf6" },
    { label: "Active Subs", value: active.length, accent: "#22c55e" },
    { label: "Avg per Sub", value: active.length > 0 ? formatCurrency(totalMonthly / active.length) : "₹0", accent: "#f59e0b" },
  ]

  return (
    <PageShell>
        <div className="mb-10">
          <p className="text-blue-300/80 text-xs uppercase tracking-[0.2em] mb-2">Insights</p>
          <h1 className="font-serif text-3xl lg:text-4xl text-white tracking-tight mb-2">
            Analytics
          </h1>
          <p className="text-white/40 text-sm">
            Where the money actually goes.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {summaryStats.map((stat, index) => (
            <Card key={stat.label} className="p-5 animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${stat.accent}20`, border: `1px solid ${stat.accent}30` }}>
                  <div className="w-2 h-2 rounded-full" style={{ background: stat.accent }} />
                </div>
                <div>
                  <p className="text-white/30 text-xs uppercase tracking-wide">{stat.label}</p>
                  <p className="text-white font-bold text-2xl tracking-tight">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-4 mb-8">
          {/* Horizontal Bar Chart - Spend by Category */}
          <Card className="overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5">
              <h2 className="font-medium text-white">Spend by Category</h2>
            </div>
            <CardContent className="p-6 pt-4">
              {categoryData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <svg className="w-12 h-12 text-white/10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="text-white/30 text-sm">No data available</p>
                </div>
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData} layout="vertical" barSize={20}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                      <XAxis
                        type="number"
                        tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11, fontFamily: "'DM Sans', sans-serif" }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => formatCurrency(v).replace(/[^\d]/g, '')}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={100}
                        tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        formatter={(value) => [formatCurrency(value), "Monthly"]}
                        contentStyle={TOOLTIP_STYLE}
                        cursor={{ fill: "rgba(255,255,255,0.03)" }}
                      />
                      <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                        {categoryData.map((_, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Billing Cycle Pie */}
          <Card className="overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5">
              <h2 className="font-medium text-white">Billing Cycle Split</h2>
            </div>
            <CardContent className="p-6 pt-4">
              <div className="h-[300px] flex flex-col">
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={billingData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={4}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        <Cell fill="#3b82f6" />
                        <Cell fill="#22c55e" />
                      </Pie>
                      <Tooltip contentStyle={TOOLTIP_STYLE} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-white/5">
                  {billingData.map((item, i) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: i === 0 ? "#3b82f6" : "#22c55e" }} />
                      <span className="text-white/40 text-sm">
                        {item.name}: <span className="text-white font-medium">{item.value}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Most Expensive */}
        <Card className="mb-8">
          <div className="px-6 py-4 border-b border-white/5">
            <h2 className="font-medium text-white">Most Expensive Subscriptions</h2>
          </div>
          <CardContent className="p-6 pt-4">
            {mostExpensive.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <svg className="w-12 h-12 text-white/10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-white/30 text-sm">No active subscriptions</p>
              </div>
            ) : (
              <div className="space-y-4">
                {mostExpensive.map((sub, index) => {
                  const monthly = sub.billingCycle === "monthly" ? sub.amount : sub.amount / 12
                  const pct = totalMonthly > 0 ? ((monthly / totalMonthly) * 100).toFixed(1) : 0
                  return (
                    <div key={sub.id} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                            style={{ background: `${COLORS[index % COLORS.length]}20`, border: `1px solid ${COLORS[index % COLORS.length]}30` }}
                          >
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-white font-medium">{sub.name}</p>
                            <p className="text-white/30 text-xs">{sub.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-semibold">{formatCurrency(monthly)}</p>
                          <p className="text-white/30 text-xs">/mo · {pct}%</p>
                        </div>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${pct}%`, background: COLORS[index % COLORS.length] }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Breakdown Table */}
        <Card>
          <div className="px-6 py-4 border-b border-white/5">
            <h2 className="font-medium text-white">Category Breakdown</h2>
          </div>
          <CardContent className="p-6 pt-4">
            {categoryData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-white/30 text-sm">No category data available</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm" role="table">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-1 text-white/30 text-xs uppercase tracking-wide font-medium">Category</th>
                      <th className="text-right py-3 px-1 text-white/30 text-xs uppercase tracking-wide font-medium">Subs</th>
                      <th className="text-right py-3 px-1 text-white/30 text-xs uppercase tracking-wide font-medium">Monthly</th>
                      <th className="text-right py-3 px-1 text-white/30 text-xs uppercase tracking-wide font-medium">Yearly</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryData.map((cat, index) => (
                      <tr key={cat.name} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                        <td className="py-3 px-1">
                          <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[index % COLORS.length] }} />
                            <span className="text-white">{cat.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-1 text-right text-white/40">{cat.count}</td>
                        <td className="py-3 px-1 text-right text-white font-medium">{formatCurrency(cat.value)}</td>
                        <td className="py-3 px-1 text-right text-white/40">{formatCurrency(cat.value * 12)}</td>
                      </tr>
                    ))}
                    <tr className="border-t border-white/10 bg-white/3">
                      <td className="py-3 px-1 text-white font-semibold">Total</td>
                      <td className="py-3 px-1 text-right text-white/50">{active.length}</td>
                      <td className="py-3 px-1 text-right text-white font-bold">{formatCurrency(totalMonthly)}</td>
                      <td className="py-3 px-1 text-right text-white font-bold">{formatCurrency(totalMonthly * 12)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
    </PageShell>
  )
}