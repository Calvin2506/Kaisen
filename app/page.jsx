import Link from "next/link"
import { Button } from "@/components/ui"
import PageShell from "@/components/PageShell"

const FEATURES = [
  {
    title: "Smart dashboard",
    desc: "Monthly spend, renewals, and category mix in one glance.",
  },
  {
    title: "Service catalog",
    desc: "Add streaming, software, and other services with clear plan prices.",
  },
  {
    title: "Renewal radar",
    desc: "See what’s due this week before the charge hits your card.",
  },
  {
    title: "AI savings",
    desc: "Get plan downgrades, yearly switches, and overlap alerts.",
  },
  {
    title: "Clean analytics",
    desc: "Understand which category is quietly eating your budget.",
  },
  {
    title: "Private by default",
    desc: "Your stack stays on your account. No social sharing, no noise.",
  },
]

export default function Home() {
  return (
    <PageShell contained={false}>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#07080d]/55 backdrop-blur-xl">
        <div className="section-container flex items-center justify-between h-16">
          <span className="font-serif text-xl text-white tracking-tight">✦ Kaisen</span>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="btn-ghost text-sm hidden sm:inline-flex">
              Login
            </Link>
            <Link href="/auth/signup">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24">
        <div className="section-container grid lg:grid-cols-[1.05fr_0.95fr] gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-7 animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-soft" />
              <span className="text-xs uppercase tracking-[0.2em] text-white/60">Track. Analyze. Save.</span>
            </div>
            <h1 className="font-serif text-white text-[clamp(2.7rem,7vw,5.4rem)] leading-[0.95] tracking-tight animate-slide-up drop-shadow-[0_12px_40px_rgba(0,0,0,0.55)]">
              Keep every
              <span className="block gradient-text">subscription honest.</span>
            </h1>
            <p className="mt-6 text-lg text-white/50 max-w-xl animate-slide-up stagger-2">
              Track plans, catch renewals, and let AI show you where your stack can get cheaper.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 animate-slide-up stagger-3">
              <Link href="/auth/signup">
                <Button size="lg">Start free</Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="secondary" size="lg">I already have an account</Button>
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-white/35 animate-slide-up stagger-4">
              <span>No credit card</span>
              <span className="text-white/15">/</span>
              <span>Clear pricing</span>
              <span className="text-white/15">/</span>
              <span>AI suggestions</span>
            </div>
          </div>

          <div className="relative h-[420px] hidden md:block">
            <div className="absolute left-8 top-8 w-72 rounded-3xl border border-white/10 bg-white/8 backdrop-blur-xl p-5 animate-float">
              <p className="text-white/40 text-xs uppercase tracking-wider">Monthly stack</p>
              <p className="font-serif text-4xl text-white mt-2">₹1,148</p>
              <div className="mt-4 space-y-3">
                {["Netflix Premium", "Spotify", "iCloud"].map((name, i) => (
                  <div key={name} className="flex items-center justify-between text-sm">
                    <span className="text-white/70">{name}</span>
                    <span className="text-white">{["₹649", "₹119", "₹75"][i]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute right-4 bottom-10 w-64 rounded-3xl border border-emerald-400/20 bg-emerald-500/10 backdrop-blur-xl p-5 animate-float-slow">
              <p className="text-emerald-300 text-xs uppercase tracking-wider">Potential save</p>
              <p className="font-serif text-3xl text-white mt-2">₹740 /mo</p>
              <p className="text-white/45 text-sm mt-3">Switch unused plans to yearly billing and drop extras you don’t use.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="section-container">
          <div className="max-w-2xl mb-12">
            <p className="text-blue-300/80 text-xs uppercase tracking-[0.2em] mb-3">Product</p>
            <h2 className="font-serif text-white text-4xl tracking-tight">A calmer way to run your digital bills.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((feature, index) => (
              <div
                key={feature.title}
                className="card-base p-6 animate-slide-up"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <div className="w-8 h-px bg-gradient-to-r from-blue-400 to-violet-400 mb-5" />
                <h3 className="text-white font-medium mb-2">{feature.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="section-container">
          <div className="rounded-[32px] border border-white/10 overflow-hidden relative px-8 py-16 lg:px-16 text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-transparent to-violet-600/20" />
            <div className="relative">
              <h2 className="font-serif text-white text-4xl lg:text-5xl tracking-tight">Ready to see the leaks?</h2>
              <p className="text-white/45 mt-4 mb-8">Add your subscriptions in a minute. Kaisen does the rest.</p>
              <Link href="/auth/signup">
                <Button size="lg">Create a free account</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-8">
        <div className="section-container">
          <p className="text-center text-white/25 text-sm">© {new Date().getFullYear()} Kaisen</p>
        </div>
      </footer>
    </PageShell>
  )
}
