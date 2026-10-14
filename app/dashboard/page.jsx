"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LabelList,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts"
import { getDaysUntilRenewal, getRenewalLabel, formatCurrency, formatCurrencyGroups, monthlyAmount, spendByCurrency } from "@/lib/helpers"
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
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [today] = useState(() => new Date())
  const [trendCurrency, setTrendCurrency] = useState("INR")
  const [remindersEnabled, setRemindersEnabled] = useState(false)

  useEffect(() => {
    if (window.localStorage.getItem("kaisen-reminders") === "enabled") {
      const frame = window.requestAnimationFrame(() => setRemindersEnabled(true))
      return () => window.cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const [subscriptionsResponse, paymentsResponse] = await Promise.all([
          fetch("/api/subscriptions"),
          fetch("/api/payments"),
        ])
        const [subscriptionsData, paymentsData] = await Promise.all([
          subscriptionsResponse.json(),
          paymentsResponse.json(),
        ])
        if (subscriptionsResponse.ok && Array.isArray(subscriptionsData)) setSubscriptions(subscriptionsData)
        if (paymentsResponse.ok && Array.isArray(paymentsData)) setPayments(paymentsData)
      } catch (error) {
        console.error("Failed to fetch", error)
      } finally {
        setLoading(false)
      }
    }
    fetchSubscriptions()
  }, [])

  useEffect(() => {
    if (!remindersEnabled || window.Notification?.permission !== "granted") return
    const checkRenewals = () => {
      const todayKey = new Date().toISOString().slice(0, 10)
      subscriptions.filter((subscription) => subscription.status === "active").forEach((subscription) => {
        const days = getDaysUntilRenewal(subscription.nextPayDate)
        if (days === null || days > 3) return
        const key = `kaisen-reminder-${subscription.id}-${todayKey}`
        if (window.localStorage.getItem(key)) return
        new window.Notification(days < 0 ? `${subscription.name} renewal is overdue` : `${subscription.name} renews soon`, {
          body: days < 0 ? "Confirm renewal or pause/cancel it if you no longer need it." : `${getRenewalLabel(days)}. Review the charge before it renews.`,
        })
        window.localStorage.setItem(key, "sent")
      })
    }
    checkRenewals()
    const interval = window.setInterval(checkRenewals, 60 * 60 * 1000)
    return () => window.clearInterval(interval)
  }, [remindersEnabled, subscriptions])

  const activeSubscriptions = subscriptions.filter((s) => s.status === "active")

  const monthlyByCurrency = spendByCurrency(activeSubscriptions)
  const yearlyByCurrency = Object.fromEntries(Object.entries(monthlyByCurrency).map(([currency, amount]) => [currency, amount * 12]))
  const totalMonthly = formatCurrencyGroups(monthlyByCurrency)
  const totalYearly = formatCurrencyGroups(yearlyByCurrency)

  const upcomingRenewals = activeSubscriptions
    .filter((sub) => {
      const days = getDaysUntilRenewal(sub.nextPayDate)
      return days !== null && days <= 7
    })
    .sort((a, b) => getDaysUntilRenewal(a.nextPayDate) - getDaysUntilRenewal(b.nextPayDate))
  const expiredRenewals = upcomingRenewals.filter((sub) => getDaysUntilRenewal(sub.nextPayDate) < 0)

  const currencyOptions = Object.keys(monthlyByCurrency)
  const chartCurrency = currencyOptions.includes(trendCurrency) ? trendCurrency : currencyOptions[0] || "INR"
  const currencySubscriptions = activeSubscriptions.filter((sub) => (sub.currency || "INR") === chartCurrency)
  const categoryData = currencySubscriptions.reduce((acc, sub) => {
    const existing = acc.find((item) => item.name === sub.category)
    const amountMonthly = monthlyAmount(sub)
    if (existing) {
      existing.value += amountMonthly
    } else {
      acc.push({ name: sub.category, value: amountMonthly })
    }
    return acc
  }, []).sort((a, b) => b.value - a.value)

  const monthlyTrend = Array.from({ length: 6 }, (_, index) => {
    const monthDate = new Date(today.getFullYear(), today.getMonth() - 5 + index, 1)
    const key = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, "0")}`
    const amount = payments
      .filter((payment) => (payment.currency || "INR") === chartCurrency && payment.paidAt?.slice(0, 7) === key)
      .reduce((sum, payment) => sum + Number(payment.amount || 0), 0)
    return { month: monthDate.toLocaleDateString("en-IN", { month: "short" }), amount }
  })

  const stats = [
    {
      label: "Monthly Spend",
      value: totalMonthly,
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
      value: totalYearly,
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

  const enableReminders = async () => {
    if (remindersEnabled) {
      window.localStorage.removeItem("kaisen-reminders")
      setRemindersEnabled(false)
      return
    }
    if (!("Notification" in window)) {
      alert("This browser does not support notifications.")
      return
    }
    const permission = await window.Notification.requestPermission()
    if (permission !== "granted") {
      alert("Allow notifications in your browser settings to receive renewal reminders.")
      return
    }
    window.localStorage.setItem("kaisen-reminders", "enabled")
    setRemindersEnabled(true)
  }

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
              <p className="font-serif text-2xl text-white mt-3 tracking-tight break-words">{stat.value}</p>
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
                <h2 className="font-medium text-white">Spend by Category · {chartCurrency}</h2>
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
                          labelLine={false}
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth={1}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                          ))}
                          <LabelList
                            dataKey="value"
                            position="outside"
                            fill="rgba(255,255,255,0.8)"
                            fontSize={11}
                            fontFamily="'DM Sans', sans-serif"
                            render={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          />
                        </Pie>
                        <Tooltip
                          formatter={(value) => [formatCurrency(value, chartCurrency), "Monthly"]}
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
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-medium text-white">Payment History</h2>
                  <p className="text-white/30 text-xs mt-1">Actual renewals marked as paid · {chartCurrency}</p>
                </div>
                {currencyOptions.length > 1 && (
                  <select value={chartCurrency} onChange={(event) => setTrendCurrency(event.target.value)} className="input-base w-auto text-sm">
                    {currencyOptions.map((currency) => <option key={currency} value={currency}>{currency}</option>)}
                  </select>
                )}
              </div>
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
                      tickFormatter={(v) => formatCurrency(v, chartCurrency).replace(/[^\d]/g, '')}
                    />
                    <Tooltip
                      formatter={(value) => [formatCurrency(value, chartCurrency), "Paid"]}
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

        <Card className="mb-8 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <div>
              <h2 className="font-medium text-white">Recent payments</h2>
              <p className="text-white/35 text-xs mt-1">Renewals you have marked as paid</p>
            </div>
            <Link href="/subscriptions" className="text-sm text-blue-400 hover:text-blue-300">Manage →</Link>
          </div>
          <CardContent className="p-4 sm:p-6">
            {payments.length === 0 ? (
              <p className="py-5 text-center text-sm text-white/40">
                Payment history starts when you mark a renewal as paid on the subscriptions page.
              </p>
            ) : (
              <div className="divide-y divide-white/5">
                {payments.slice(0, 5).map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between gap-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">{payment.subscriptionName}</p>
                      <p className="mt-1 text-xs text-white/35">{new Date(payment.paidAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                    </div>
                    <p className="shrink-0 font-medium text-white">{formatCurrency(payment.amount, payment.currency)}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Renewals */}
        <Card>
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <h2 className="font-medium text-white">
              {expiredRenewals.length > 0 ? "Renewals needing attention" : "Upcoming Renewals"}
            </h2>
            <div className="flex items-center gap-4">
              <button type="button" onClick={enableReminders} className="text-xs text-blue-300 hover:text-white">
                {remindersEnabled ? "Reminders on · turn off" : "Enable reminders"}
              </button>
              <Link href="/subscriptions" className="text-sm text-blue-400 hover:text-blue-300 font-medium">
                View all →
              </Link>
            </div>
          </div>
          <p className="px-6 pt-3 text-xs text-white/30">Browser notifications are checked while you have the app open.</p>
          {expiredRenewals.length > 0 && (
            <div className="mx-6 mt-5 rounded-xl border border-red-400/25 bg-red-500/10 p-4" role="alert">
              <p className="text-red-200 font-medium">
                {expiredRenewals.length} active {expiredRenewals.length === 1 ? "subscription has" : "subscriptions have"} passed its renewal date.
              </p>
              <p className="mt-1 text-sm text-white/60">
                Confirm renewal or cancel/pause anything you no longer need.
              </p>
              <Link href="/subscriptions" className="inline-block mt-2 text-sm font-medium text-red-200 hover:text-white">
                Review subscriptions →
              </Link>
            </div>
          )}
          <CardContent className="p-6 pt-0">
            {upcomingRenewals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <span className="text-4xl mb-3">🎉</span>
                <p className="text-white/30 text-sm">No renewals in the next 7 days</p>
                <p className="text-white/20 text-xs mt-1">You&apos;re all caught up!</p>
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
                            {getRenewalLabel(days)}
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
