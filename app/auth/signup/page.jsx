"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button, Input } from "@/components/ui"
import PageShell from "@/components/PageShell"

export default function Signup() {
  const router = useRouter()
  const [formData, setFormData] = useState({ name: "", email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (error) setError("")
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
    <PageShell contained={false}>
      <div className="min-h-screen grid lg:grid-cols-2">
        <div className="hidden lg:flex flex-col justify-between p-12 border-r border-white/5">
          <Link href="/" className="font-serif text-2xl text-white">✦ Kaisen</Link>
          <div>
            <p className="font-serif text-5xl text-white leading-tight">Start seeing<br />what you pay for.</p>
            <p className="text-white/40 mt-4 max-w-sm">Free forever. Add streaming, software, or any other service in under a minute.</p>
          </div>
          <div className="flex gap-6 text-sm text-white/35">
            <span>Free forever</span>
            <span>Private</span>
            <span>Service catalog</span>
          </div>
        </div>

        <div className="flex items-center justify-center p-6">
          <div className="w-full max-w-md animate-slide-up">
            <Link href="/" className="lg:hidden font-serif text-2xl text-white block text-center mb-10">✦ Kaisen</Link>
            <div className="card-base p-8">
              <h1 className="font-serif text-3xl text-white tracking-tight">Create account</h1>
              <p className="text-white/40 text-sm mt-2 mb-8">Track subscriptions without the spreadsheet.</p>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Full name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  autoComplete="name"
                />
                <Input
                  label="Email address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  required
                  autoComplete="new-password"
                  minLength={8}
                />
                <Button type="submit" className="w-full" size="lg" loading={loading}>
                  Create account
                </Button>
              </form>

              <p className="text-center text-white/30 text-sm mt-8">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-blue-400 hover:text-blue-300">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
