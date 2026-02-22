"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts"
import { getDaysUntilRenewal, formatCurrency } from "@/lib/helpers"

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#22c55e", "#eab308", "#06b6d4", "#ef4444", "#f97316"]

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap');
  .stat-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 28px;
    transition: border-color 0.2s ease;
  }
  .stat-card:hover { border-color: rgba(255,255,255,0.15); }
  .chart-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 28px;
  }
  .renewal-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px;
    transition: border-color 0.2s ease;
  }
  .renewal-item:hover { border-color: rgba(255,255,255,0.12); }
`

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
  }, [])

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const monthlyTrend = monthNames.map((month) => ({
    month,
    amount: parseFloat(totalMonthly.toFixed(2)),
  }))

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#080b12", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif" }}>Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", background: "#080b12", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{styles}</style>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 32px" }}>

        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "32px",
            color: "white",
            marginBottom: "6px",
            letterSpacing: "-0.5px"
          }}>
            Good morning, {session?.user?.name?.split(" ")[0]} 👋
          </h1>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "15px" }}>
            Here's your subscription overview for today
          </p>
        </div>

        {/* Stat Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginBottom: "32px"
        }}>
          {[
            {
              label: "Monthly Spend",
              value: formatCurrency(totalMonthly),
              sub: "across active subscriptions",
              accent: "#3b82f6"
            },
            {
              label: "Yearly Projection",
              value: formatCurrency(totalYearly),
              sub: "estimated annual cost",
              accent: "#8b5cf6"
            },
            {
              label: "Active Subscriptions",
              value: activeSubscriptions.length,
              sub: `${subscriptions.length} total tracked`,
              accent: "#22c55e"
            },
            {
              label: "Upcoming Renewals",
              value: upcomingRenewals.length,
              sub: "due in next 7 days",
              accent: upcomingRenewals.length > 0 ? "#f59e0b" : "#22c55e"
            },
          ].map((stat) => (
            <div key={stat.label} className="stat-card">
              <div style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: stat.accent,
                marginBottom: "16px"
              }} />
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", fontWeight: "500", marginBottom: "8px" }}>
                {stat.label}
              </p>
              <p style={{ color: "white", fontSize: "28px", fontWeight: "700", marginBottom: "4px", letterSpacing: "-0.5px" }}>
                {stat.value}
              </p>
              <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "12px" }}>{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "16px",
          marginBottom: "32px"
        }}>
          {/* Pie Chart */}
          <div className="chart-card">
            <h2 style={{ color: "white", fontSize: "16px", fontWeight: "600", marginBottom: "24px" }}>
              Spend by Category
            </h2>
            {categoryData.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "14px" }}>No data yet</p>
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatCurrency(value)}
                      contentStyle={{
                        background: "#1a1f2e",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "10px",
                        color: "white",
                        fontSize: "13px"
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "16px" }}>
                  {categoryData.map((entry, index) => (
                    <div key={entry.name} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <div style={{
                        width: "8px", height: "8px", borderRadius: "50%",
                        background: COLORS[index % COLORS.length]
                      }} />
                      <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "12px" }}>{entry.name}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Bar Chart */}
          <div className="chart-card">
            <h2 style={{ color: "white", fontSize: "16px", fontWeight: "600", marginBottom: "24px" }}>
              Monthly Spend Trend
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyTrend} barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${v}`}
                />
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{
                    background: "#1a1f2e",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "10px",
                    color: "white",
                    fontSize: "13px"
                  }}
                  cursor={{ fill: "rgba(255,255,255,0.04)" }}
                />
                <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming Renewals */}
        <div className="chart-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <h2 style={{ color: "white", fontSize: "16px", fontWeight: "600" }}>
              Upcoming Renewals
            </h2>
            <Link href="/subscriptions" style={{
              color: "#3b82f6",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: "500"
            }}>
              View all →
            </Link>
          </div>

          {upcomingRenewals.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <p style={{ fontSize: "24px", marginBottom: "8px" }}>🎉</p>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px" }}>
                No renewals in the next 7 days
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {upcomingRenewals.map((sub) => {
                const days = getDaysUntilRenewal(sub.nextPayDate)
                return (
                  <div key={sub.id} className="renewal-item">
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <div style={{
                        width: "40px", height: "40px", borderRadius: "10px",
                        background: "rgba(59,130,246,0.1)",
                        border: "1px solid rgba(59,130,246,0.2)",
                        display: "flex", alignItems: "center",
                        justifyContent: "center", fontSize: "16px"
                      }}>
                        💳
                      </div>
                      <div>
                        <p style={{ color: "white", fontSize: "14px", fontWeight: "600", marginBottom: "2px" }}>
                          {sub.name}
                        </p>
                        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>
                          {sub.category}
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ color: "white", fontSize: "15px", fontWeight: "700", marginBottom: "2px" }}>
                        {formatCurrency(sub.amount, sub.currency)}
                      </p>
                      <p style={{
                        fontSize: "12px", fontWeight: "500",
                        color: days <= 3 ? "#f87171" : days <= 7 ? "#fbbf24" : "#4ade80"
                      }}>
                        {days === 0 ? "Due today!" : days === 1 ? "Due tomorrow" : `${days} days left`}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}