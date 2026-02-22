"use client"

import { useState, useEffect } from "react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts"
import { formatCurrency } from "@/lib/helpers"

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#22c55e", "#eab308", "#06b6d4", "#ef4444", "#f97316"]

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap');
  .analytics-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 28px;
  }
  .stat-pill {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 14px;
    padding: 24px;
    transition: border-color 0.2s ease;
  }
  .stat-pill:hover { border-color: rgba(255,255,255,0.15); }
  .table-row {
    display: grid;
    grid-template-columns: 1fr 80px 120px 120px;
    align-items: center;
    padding: 14px 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    transition: background 0.15s ease;
  }
  .table-row:last-child { border-bottom: none; }
  .table-row:hover { background: rgba(255,255,255,0.02); }
`

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
    return (
      <div style={{ minHeight: "100vh", background: "#080b12", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans', sans-serif" }}>Loading analytics...</p>
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
            fontSize: "32px", color: "white",
            letterSpacing: "-0.5px", marginBottom: "6px"
          }}>
            Analytics
          </h1>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "15px" }}>
            Deep dive into your subscription spending
          </p>
        </div>

        {/* Summary Stats */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "12px",
          marginBottom: "28px"
        }}>
          {[
            { label: "Monthly Spend", value: formatCurrency(totalMonthly), accent: "#3b82f6" },
            { label: "Yearly Spend", value: formatCurrency(totalMonthly * 12), accent: "#8b5cf6" },
            { label: "Active Subs", value: active.length, accent: "#22c55e" },
            { label: "Avg per Sub", value: active.length > 0 ? formatCurrency(totalMonthly / active.length) : "₹0", accent: "#f59e0b" },
          ].map((stat) => (
            <div key={stat.label} className="stat-pill">
              <div style={{
                width: "6px", height: "6px", borderRadius: "50%",
                background: stat.accent, marginBottom: "14px"
              }} />
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", fontWeight: "500", marginBottom: "6px" }}>
                {stat.label}
              </p>
              <p style={{ color: "white", fontSize: "24px", fontWeight: "700", letterSpacing: "-0.5px" }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
          gap: "16px",
          marginBottom: "24px"
        }}>

          {/* Horizontal Bar Chart */}
          <div className="analytics-card">
            <h2 style={{ color: "white", fontSize: "16px", fontWeight: "600", marginBottom: "24px" }}>
              Spend by Category
            </h2>
            {categoryData.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "14px" }}>No data yet</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={categoryData} layout="vertical" barSize={14}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 11 }}
                    axisLine={false} tickLine={false}
                    tickFormatter={(v) => `₹${v}`}
                  />
                  <YAxis
                    type="category" dataKey="name" width={95}
                    tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                    axisLine={false} tickLine={false}
                  />
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{
                      background: "#1a1f2e",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "10px", color: "white", fontSize: "13px"
                    }}
                    cursor={{ fill: "rgba(255,255,255,0.03)" }}
                  />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                    {categoryData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Billing Cycle Pie */}
          <div className="analytics-card">
            <h2 style={{ color: "white", fontSize: "16px", fontWeight: "600", marginBottom: "24px" }}>
              Billing Cycle Split
            </h2>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={billingData}
                  cx="50%" cy="50%"
                  innerRadius={65} outerRadius={100}
                  paddingAngle={4} dataKey="value"
                >
                  <Cell fill="#3b82f6" />
                  <Cell fill="#22c55e" />
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#1a1f2e",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "10px", color: "white", fontSize: "13px"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", justifyContent: "center", gap: "24px" }}>
              {billingData.map((item, i) => (
                <div key={item.name} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{
                    width: "10px", height: "10px", borderRadius: "50%",
                    background: i === 0 ? "#3b82f6" : "#22c55e"
                  }} />
                  <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "13px" }}>
                    {item.name}: <strong style={{ color: "white" }}>{item.value}</strong>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Most Expensive */}
        <div className="analytics-card" style={{ marginBottom: "24px" }}>
          <h2 style={{ color: "white", fontSize: "16px", fontWeight: "600", marginBottom: "24px" }}>
            Most Expensive Subscriptions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {mostExpensive.map((sub, index) => {
              const monthly = sub.billingCycle === "monthly" ? sub.amount : sub.amount / 12
              const pct = totalMonthly > 0 ? ((monthly / totalMonthly) * 100).toFixed(1) : 0
              return (
                <div key={sub.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{
                        width: "22px", height: "22px", borderRadius: "6px",
                        background: `${COLORS[index % COLORS.length]}20`,
                        border: `1px solid ${COLORS[index % COLORS.length]}30`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "11px", fontWeight: "700",
                        color: COLORS[index % COLORS.length]
                      }}>
                        {index + 1}
                      </span>
                      <span style={{ color: "white", fontSize: "14px", fontWeight: "500" }}>{sub.name}</span>
                      <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "12px" }}>{sub.category}</span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ color: "white", fontSize: "14px", fontWeight: "600" }}>
                        {formatCurrency(monthly)}
                      </span>
                      <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>/mo</span>
                      <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "12px", marginLeft: "8px" }}>
                        {pct}%
                      </span>
                    </div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "100px", height: "4px" }}>
                    <div style={{
                      height: "4px", borderRadius: "100px",
                      width: `${pct}%`,
                      background: COLORS[index % COLORS.length],
                      transition: "width 0.5s ease"
                    }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Category Table */}
        <div className="analytics-card">
          <h2 style={{ color: "white", fontSize: "16px", fontWeight: "600", marginBottom: "24px" }}>
            Category Breakdown
          </h2>

          {/* Table Header */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 80px 120px 120px",
            padding: "0 0 12px",
            borderBottom: "1px solid rgba(255,255,255,0.08)"
          }}>
            {["Category", "Subs", "Monthly", "Yearly"].map((h) => (
              <p key={h} style={{
                color: "rgba(255,255,255,0.3)",
                fontSize: "11px", fontWeight: "600",
                textTransform: "uppercase", letterSpacing: "0.5px",
                textAlign: h === "Category" ? "left" : "right"
              }}>
                {h}
              </p>
            ))}
          </div>

          {/* Rows */}
          {categoryData.map((cat, index) => (
            <div key={cat.name} className="table-row">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "8px", height: "8px", borderRadius: "50%",
                  background: COLORS[index % COLORS.length]
                }} />
                <span style={{ color: "white", fontSize: "14px" }}>{cat.name}</span>
              </div>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", textAlign: "right" }}>
                {cat.count}
              </p>
              <p style={{ color: "white", fontSize: "14px", fontWeight: "500", textAlign: "right" }}>
                {formatCurrency(cat.value)}
              </p>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", textAlign: "right" }}>
                {formatCurrency(cat.value * 12)}
              </p>
            </div>
          ))}

          {/* Total Row */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 80px 120px 120px",
            padding: "16px 0 0",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            marginTop: "4px"
          }}>
            <p style={{ color: "white", fontSize: "14px", fontWeight: "600" }}>Total</p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", textAlign: "right" }}>
              {active.length}
            </p>
            <p style={{ color: "white", fontSize: "14px", fontWeight: "700", textAlign: "right" }}>
              {formatCurrency(totalMonthly)}
            </p>
            <p style={{ color: "white", fontSize: "14px", fontWeight: "700", textAlign: "right" }}>
              {formatCurrency(totalMonthly * 12)}
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}