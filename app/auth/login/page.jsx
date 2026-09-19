"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button, Input } from "@/components/ui"
import PageShell from "@/components/PageShell"

export default function Login() {
  const router = useRouter()
  const [formData, setFormData] = useState({ email: "", password: "" })
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
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })
      if (result?.error) {
        setError("Invalid email or password")
        setLoading(false)
        return
      }
      router.push("/dashboard")
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
            <p className="font-serif text-5xl text-white leading-tight">Your stack,<br />finally visible.</p>
            <p className="text-white/40 mt-4 max-w-sm">Sign in to check renewals, plan details, and AI savings in one place.</p>
          </div>
          <p className="text-white/25 text-sm">Secure by default. Private by design.</p>
        </div>

        <div className="flex items-center justify-center p-6">
          <div className="w-full max-w-md animate-slide-up">
            <Link href="/" className="lg:hidden font-serif text-2xl text-white block text-center mb-10">✦ Kaisen</Link>
            <div className="card-base p-8">
              <h1 className="font-serif text-3xl text-white tracking-tight">Welcome back</h1>
              <p className="text-white/40 text-sm mt-2 mb-8">Sign in to continue tracking.</p>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
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
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <Button type="submit" className="w-full" size="lg" loading={loading}>
                  Sign in
                </Button>
              </form>

              <p className="text-center text-white/30 text-sm mt-8">
                Don’t have an account?{" "}
                <Link href="/auth/signup" className="text-blue-400 hover:text-blue-300">
                  Sign up free
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
