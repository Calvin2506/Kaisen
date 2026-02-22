"use client"

import { useState, useEffect } from "react"
import { formatCurrency } from "@/lib/helpers"

const FREE_ALTERNATIVES = {
  Entertainment: [
    { paid: "Netflix", free: "Tubi", description: "Free movies and TV shows with ads" },
    { paid: "Disney+", free: "Pluto TV", description: "Free streaming with ads" },
  ],
  Music: [
    { paid: "Spotify", free: "Spotify Free", description: "Free tier with ads and shuffle only" },
    { paid: "Apple Music", free: "YouTube Music Free", description: "Free music with ads" },
  ],
  Productivity: [
    { paid: "Notion", free: "Notion Free", description: "Free tier is generous for personal use" },
    { paid: "Evernote", free: "Obsidian", description: "Completely free and powerful" },
  ],
  "Cloud Storage": [
    { paid: "iCloud", free: "Google Drive", description: "15GB free storage" },
    { paid: "Dropbox", free: "Google Drive", description: "15GB free vs 2GB on Dropbox free" },
  ],
  Education: [
    { paid: "Coursera", free: "YouTube / freeCodeCamp", description: "Huge free learning content" },
    { paid: "LinkedIn Learning", free: "Coursera Audit", description: "Audit courses for free" },
  ],
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap');
  .suggestion-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 28px;
    margin-bottom: 16px;
  }
  .tip-item {
    display: flex;
    gap: 16px;
    padding: 16px 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .tip-item:last-child { border-bottom: none; }
  .alt-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px;
    padding: 14px 18px;
    margin-bottom: 10px;
    transition: border-color 0.15s ease;
  }
  .alt-row:hover { border-color: rgba(255,255,255,0.12); }
  .yearly-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px;
    padding: 14px 18px;
    margin-bottom: 10px;
    transition: border-color 0.15s ease;
  }
  .yearly-row:hover { border-color: rgba(34,197,94,0.2); }
  .duplicate-tag {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 100px;
    font-size: 12px;
    font-weight: 500;
    background: rgba(251,191,36,0.1);
    border: 1px solid rgba(251,191,36,0.2);
    color: #fbbf24;
    margin: 4px;
  }
`

export default function Suggestions() {
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSubscriptions = async () => {
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
    fetchSubscriptions()
  }, [])

  const active = subscriptions.filter((s) => s.status === "active")

  const totalMonthly = active.reduce((sum, sub) => {
    return sum + (sub.billingCycle === "monthly" ? sub.amount : sub.amount / 12)
  }, 0)

  const monthlySubs = active.filter((s) => s.billingCycle === "monthly")

  const potentialYearlySavings = monthlySubs.reduce((sum, sub) => {
    return sum + sub.amount * 12 * 0.2
  }, 0)

  const categoryCount = active.reduce((acc, sub) => {
    acc[sub.category] = (acc[sub.category] || 0) + 1
    return acc
  }, {})

  const duplicateCategories = Object.entries(categoryCount)
    .filter(([_, count]) => count > 1)
    .map(([category, count]) => ({ category, count }))

  const categorySpend = active.reduce((acc, sub) => {
    const monthly = sub.billingCycle === "monthly" ? sub.amount : sub.amount / 12
    acc[sub.category] = (acc[sub.category] || 0) + monthly
    return acc
  }, {})

  const mostExpensiveCategory = Object.entries(categorySpend)
    .sort((a, b) => b[1] - a[1])[0]

  const userAlternatives = active
    .map((sub) => {
      const alternatives = FREE_ALTERNATIVES[sub.category] || []
      const match = alternatives.find(
        (alt) =>
          sub.name.toLowerCase().includes(alt.paid.toLowerCase()) ||
          alt.paid.toLowerCase().includes(sub.name.toLowerCase())
      )
      return match ? { sub, alternative: match } : null
    })
    .filter(Boolean)

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#080b12", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans', sans-serif" }}>
          Analyzing your subscriptions...
        </p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", background: "#080b12", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{styles}</style>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 32px" }}>

        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "32px", color: "white",
            letterSpacing: "-0.5px", marginBottom: "6px"
          }}>
            Suggestions
          </h1>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "15px" }}>
            Personalized tips to reduce your subscription costs
          </p>
        </div>

        {/* Savings Summary Banner */}
        <div style={{
          background: "linear-gradient(135deg, rgba(37,99,235,0.15), rgba(79,70,229,0.15))",
          border: "1px solid rgba(59,130,246,0.2)",
          borderRadius: "16px",
          padding: "28px",
          marginBottom: "24px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "24px"
        }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", fontWeight: "500",
              textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
              Potential Yearly Savings
            </p>
            <p style={{ color: "#60a5fa", fontSize: "32px", fontWeight: "700", letterSpacing: "-1px" }}>
              {formatCurrency(potentialYearlySavings)}
            </p>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", marginTop: "4px" }}>
              by switching to yearly plans
            </p>
          </div>
          <div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", fontWeight: "500",
              textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
              Potential Monthly Savings
            </p>
            <p style={{ color: "#a78bfa", fontSize: "32px", fontWeight: "700", letterSpacing: "-1px" }}>
              {formatCurrency(totalMonthly * 0.3)}
            </p>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", marginTop: "4px" }}>
              by cancelling unused subs
            </p>
          </div>
        </div>

        {/* Duplicate Categories */}
        {duplicateCategories.length > 0 && (
          <div className="suggestion-card" style={{ borderColor: "rgba(251,191,36,0.15)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span style={{
                background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)",
                borderRadius: "8px", padding: "6px 10px", fontSize: "16px"
              }}>⚠️</span>
              <h2 style={{ color: "white", fontSize: "16px", fontWeight: "600" }}>
                Overlapping Subscriptions
              </h2>
            </div>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "14px", marginBottom: "20px", lineHeight: "1.6" }}>
              You have multiple subscriptions in the same category. Consider keeping only the one you use most.
            </p>
            {duplicateCategories.map(({ category }) => {
              const subs = active.filter((s) => s.category === category)
              return (
                <div key={category} style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "12px", padding: "16px", marginBottom: "10px"
                }}>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", fontWeight: "600",
                    textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" }}>
                    {category}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap" }}>
                    {subs.map((sub) => (
                      <span key={sub.id} className="duplicate-tag">
                        {sub.name} · {formatCurrency(sub.amount)}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Switch to Yearly */}
        {monthlySubs.length > 0 && (
          <div className="suggestion-card" style={{ borderColor: "rgba(34,197,94,0.15)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span style={{
                background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)",
                borderRadius: "8px", padding: "6px 10px", fontSize: "16px"
              }}>📅</span>
              <h2 style={{ color: "white", fontSize: "16px", fontWeight: "600" }}>
                Switch to Yearly Plans
              </h2>
            </div>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "14px", marginBottom: "20px", lineHeight: "1.6" }}>
              Most services offer ~20% discount on yearly plans. These monthly subscriptions could save you money:
            </p>
            {monthlySubs.map((sub) => {
              const currentYearly = sub.amount * 12
              const discountedYearly = currentYearly * 0.8
              const savings = currentYearly - discountedYearly
              return (
                <div key={sub.id} className="yearly-row">
                  <div>
                    <p style={{ color: "white", fontSize: "14px", fontWeight: "500", marginBottom: "3px" }}>
                      {sub.name}
                    </p>
                    <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>
                      {formatCurrency(sub.amount)}/mo → {formatCurrency(discountedYearly)}/yr (est.)
                    </p>
                  </div>
                  <div style={{
                    background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)",
                    borderRadius: "8px", padding: "6px 14px", textAlign: "center"
                  }}>
                    <p style={{ color: "#4ade80", fontSize: "13px", fontWeight: "600" }}>
                      Save {formatCurrency(savings)}/yr
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Highest Spending Category */}
        {mostExpensiveCategory && (
          <div className="suggestion-card" style={{ borderColor: "rgba(239,68,68,0.15)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span style={{
                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: "8px", padding: "6px 10px", fontSize: "16px"
              }}>🔥</span>
              <h2 style={{ color: "white", fontSize: "16px", fontWeight: "600" }}>
                Highest Spending Category
              </h2>
            </div>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "14px", lineHeight: "1.7" }}>
              You spend the most on{" "}
              <span style={{ color: "white", fontWeight: "600" }}>{mostExpensiveCategory[0]}</span>{" "}
              at{" "}
              <span style={{ color: "#f87171", fontWeight: "600" }}>
                {formatCurrency(mostExpensiveCategory[1])}/month
              </span>
              . Review these subscriptions and consider keeping only the ones you use daily.
            </p>
          </div>
        )}

        {/* Free Alternatives */}
        {userAlternatives.length > 0 && (
          <div className="suggestion-card">
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span style={{
                background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)",
                borderRadius: "8px", padding: "6px 10px", fontSize: "16px"
              }}>🆓</span>
              <h2 style={{ color: "white", fontSize: "16px", fontWeight: "600" }}>
                Free Alternatives Available
              </h2>
            </div>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "14px", marginBottom: "20px" }}>
              These subscriptions have solid free alternatives worth considering.
            </p>
            {userAlternatives.map(({ sub, alternative }) => (
              <div key={sub.id} className="alt-row">
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span style={{ color: "white", fontSize: "14px", fontWeight: "500" }}>{sub.name}</span>
                    <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>→</span>
                    <span style={{ color: "#4ade80", fontSize: "14px", fontWeight: "500" }}>
                      {alternative.free}
                    </span>
                  </div>
                  <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>
                    {alternative.description}
                  </p>
                </div>
                <div style={{
                  background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)",
                  borderRadius: "8px", padding: "6px 12px", marginLeft: "16px", whiteSpace: "nowrap"
                }}>
                  <p style={{ color: "#f87171", fontSize: "12px", fontWeight: "600" }}>
                    -{formatCurrency(sub.amount)}/mo
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* General Tips */}
        <div className="suggestion-card">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <span style={{
              background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)",
              borderRadius: "8px", padding: "6px 10px", fontSize: "16px"
            }}>💪</span>
            <h2 style={{ color: "white", fontSize: "16px", fontWeight: "600" }}>
              General Tips
            </h2>
          </div>
          {[
            { icon: "🔍", title: "Do a monthly audit", desc: "Every month, review all your subscriptions and ask: did I use this enough to justify the cost?" },
            { icon: "👨‍👩‍👧‍👦", title: "Share plans with family", desc: "Netflix, Spotify, iCloud and many others offer family plans that are significantly cheaper per person." },
            { icon: "⏱️", title: "Use free trials wisely", desc: "Sign up for free trials when you need a service for a short project, then cancel before billing." },
            { icon: "💬", title: "Negotiate or pause", desc: "Many services offer pause options or retention discounts if you contact them before cancelling." },
            { icon: "🎓", title: "Check student discounts", desc: "Spotify, Apple Music, Adobe and many others offer 50%+ discounts for students." },
          ].map((item) => (
            <div key={item.title} className="tip-item">
              <div style={{
                width: "36px", height: "36px", borderRadius: "10px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "16px",
                flexShrink: 0
              }}>
                {item.icon}
              </div>
              <div>
                <p style={{ color: "white", fontSize: "14px", fontWeight: "600", marginBottom: "4px" }}>
                  {item.title}
                </p>
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", lineHeight: "1.6" }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}