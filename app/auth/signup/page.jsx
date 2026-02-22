"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Signup() {
  const router = useRouter()
  const [formData, setFormData] = useState({ name: "", email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error)
        setLoading(false)
        return
      }
      router.push("/auth/login")
    } catch (error) {
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080b12",
      display: "flex",
      fontFamily: "'DM Sans', sans-serif"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap');
        .input-field {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s ease;
          box-sizing: border-box;
        }
        .input-field::placeholder { color: rgba(255,255,255,0.25); }
        .input-field:focus { border-color: rgba(59,130,246,0.6); background: rgba(255,255,255,0.06); }
        .submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          color: white;
          border: none;
          padding: 13px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }
        .submit-btn:hover { opacity: 0.9; }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

      {/* Left Panel */}
      <div style={{
        flex: 1,
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px"
      }}>
        <div style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "36px",
          color: "white",
          marginBottom: "16px",
          lineHeight: "1.2"
        }}>
          Your subscriptions, finally under control
        </div>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "16px", lineHeight: "1.7", marginBottom: "48px" }}>
          Join thousands tracking their subscriptions smarter. Free forever, no credit card required.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {[
            { icon: "✅", text: "Free forever, no hidden fees" },
            { icon: "🔒", text: "Your data is private and secure" },
            { icon: "📱", text: "Works on all your devices" },
          ].map((item) => (
            <div key={item.text} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "20px" }}>{item.icon}</span>
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "15px" }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div style={{
        width: "100%",
        maxWidth: "480px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "48px 40px",
        background: "#080b12",
        borderLeft: "1px solid rgba(255,255,255,0.06)"
      }}>
        <div style={{ marginBottom: "40px" }}>
          <div style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "28px",
            color: "white",
            marginBottom: "8px"
          }}>
            Create your account
          </div>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>
            Start tracking your subscriptions for free with Kaisen.
          </p>
        </div>

        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            color: "#f87171",
            padding: "12px 16px",
            borderRadius: "10px",
            fontSize: "14px",
            marginBottom: "24px"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={{ display: "block", color: "rgba(255,255,255,0.5)", fontSize: "13px", fontWeight: "500", marginBottom: "8px" }}>
              Full name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              required
              className="input-field"
            />
          </div>

          <div>
            <label style={{ display: "block", color: "rgba(255,255,255,0.5)", fontSize: "13px", fontWeight: "500", marginBottom: "8px" }}>
              Email address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="input-field"
            />
          </div>

          <div>
            <label style={{ display: "block", color: "rgba(255,255,255,0.5)", fontSize: "13px", fontWeight: "500", marginBottom: "8px" }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="input-field"
            />
          </div>

          <button type="submit" disabled={loading} className="submit-btn" style={{ marginTop: "8px" }}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px", textAlign: "center", marginTop: "32px" }}>
          Already have an account?{" "}
          <Link href="/auth/login" style={{ color: "#60a5fa", textDecoration: "none", fontWeight: "500" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}