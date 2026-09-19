"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { Avatar, Button } from "@/components/ui"

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/subscriptions", label: "Subscriptions" },
  { href: "/analytics", label: "Analytics" },
  { href: "/suggestions", label: "Suggestions" },
]

export default function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#07080d]/70 backdrop-blur-2xl">
      <div className="section-container">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/dashboard"
            className="font-serif text-xl text-white tracking-tight hover:opacity-80 transition-opacity"
          >
            ✦ Kaisen
          </Link>

          <div className="hidden md:flex items-center gap-1 p-1 rounded-full bg-white/5 border border-white/8">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-white text-slate-900 shadow-lg"
                      : "text-white/50 hover:text-white"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-3">
            {session && (
              <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 bg-white/5 border border-white/8 rounded-full">
                <Avatar name={session.user?.name} size="sm" />
                <span className="text-sm font-medium text-white/70">
                  {session.user?.name?.split(" ")[0]}
                </span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:inline-flex"
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
            >
              Logout
            </Button>
            <button
              className="md:hidden p-2 rounded-lg text-white/70 hover:bg-white/5"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden pb-4 animate-slide-down">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm ${
                    pathname === link.href ? "bg-white/10 text-white" : "text-white/50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <button
                className="text-left px-4 py-2.5 text-sm text-white/50"
                onClick={() => signOut({ callbackUrl: "/auth/login" })}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
