"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/subscriptions", label: "Subscriptions" },
  { href: "/analytics", label: "Analytics" },
  { href: "/suggestions", label: "Suggestions" },
]

export default function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <nav style={{
      background: "#0f1117",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
      position: "sticky",
      top: 0,
      zIndex: 50,
      fontFamily: "'DM Sans', sans-serif"
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap');`}</style>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "64px"
      }}>
        <Link href="/dashboard" style={{
            textDecoration: "none",
            fontFamily: "'DM Serif Display', serif",
            fontSize: "20px",
            color: "white",
            letterSpacing: "-0.5px"
          }}>
          ✦ Kaisen
        </Link>

        {/* Nav Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                textDecoration: "none",
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "500",
                color: pathname === link.href ? "white" : "rgba(255,255,255,0.5)",
                background: pathname === link.href ? "rgba(255,255,255,0.08)" : "transparent",
                transition: "all 0.15s ease"
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* User + Logout */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "10px",
            padding: "8px 14px"
          }}>
            <div style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #2563eb, #4f46e5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: "600",
              color: "white"
            }}>
              {session?.user?.name?.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", fontWeight: "500" }}>
              {session?.user?.name?.split(" ")[0]}
            </span>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.5)",
              fontSize: "13px",
              fontWeight: "500",
              padding: "8px 16px",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.15s ease"
            }}
          >
            Logout
          </button>
        </div>

      </div>
    </nav>
  )
}