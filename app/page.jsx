import { Yesteryear } from "next/font/google"
import Link from "next/link"

export default function Home() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="min-h-screen bg-gray-950 overflow-x-hidden">

      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');
        * { box-sizing: border-box; }
        .hero-glow {
          background: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59,130,246,0.3), transparent);
        }
        .card-hover {
          transition: transform 0.2s ease, border-color 0.2s ease;
        }
        .card-hover:hover {
          transform: translateY(-4px);
          border-color: rgba(59,130,246,0.5);
        }
        .gradient-text {
          background: linear-gradient(135deg, #60a5fa, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .badge {
          background: rgba(59,130,246,0.1);
          border: 1px solid rgba(59,130,246,0.3);
          backdrop-filter: blur(10px);
        }
        .btn-primary {
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          transition: opacity 0.2s ease, transform 0.2s ease;
        }
        .btn-primary:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }
        .btn-secondary {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          transition: background 0.2s ease;
        }
        .btn-secondary:hover {
          background: rgba(255,255,255,0.1);
        }
        .feature-icon {
          background: linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2));
          border: 1px solid rgba(59,130,246,0.2);
        }
        .section-divider {
          background: linear-gradient(90deg, transparent, rgba(59,130,246,0.3), transparent);
          height: 1px;
        }
      `}</style>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{
        background: "rgba(3,7,18,0.8)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)"
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
            <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "22px", color: "white", letterSpacing: "-0.5px" }}>
              ✦ Kaisen
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Link href="/auth/login" style={{
                color: "rgba(255,255,255,0.6)",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "500",
                padding: "8px 16px",
                borderRadius: "8px",
                transition: "color 0.2s"
              }}>
                Login
              </Link>
              <Link href="/auth/signup" className="btn-primary" style={{
                color: "white",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "600",
                padding: "10px 20px",
                borderRadius: "10px",
                display: "inline-block"
              }}>
                Get Started →
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-glow" style={{ paddingTop: "160px", paddingBottom: "100px", textAlign: "center", padding: "160px 24px 100px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          
          <div className="badge" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 16px",
            borderRadius: "100px",
            fontSize: "13px",
            color: "#93c5fd",
            marginBottom: "32px"
          }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#3b82f6", display: "inline-block" }}></span>
            Track • Analyze • Save
          </div>

          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(42px, 7vw, 76px)",
            color: "white",
            lineHeight: "1.1",
            letterSpacing: "-2px",
            marginBottom: "24px"
          }}>
            Stop Wasting Money on{" "}
            <span className="gradient-text">Forgotten Subscriptions</span>
          </h1>

          <p style={{
            fontSize: "clamp(16px, 2vw, 20px)",
            color: "rgba(255,255,255,0.5)",
            lineHeight: "1.7",
            marginBottom: "48px",
            maxWidth: "560px",
            margin: "0 auto 48px"
          }}>
            Track all your subscriptions in one place, get renewal alerts before they hit, 
            and discover smart ways to cut your monthly expenses.
          </p>

          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/auth/signup" className="btn-primary" style={{
              color: "white",
              textDecoration: "none",
              fontSize: "16px",
              fontWeight: "600",
              padding: "16px 32px",
              borderRadius: "12px",
              display: "inline-block"
            }}>
              Start for Free →
            </Link>
            <Link href="/auth/login" className="btn-secondary" style={{
              color: "rgba(255,255,255,0.7)",
              textDecoration: "none",
              fontSize: "16px",
              fontWeight: "500",
              padding: "16px 32px",
              borderRadius: "12px",
              display: "inline-block"
            }}>
              Login
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{ maxWidth: "1100px", margin: "0 auto 80px", padding: "0 24px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1px",
          background: "rgba(255,255,255,0.06)",
          borderRadius: "16px",
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.06)"
        }}>
          {[
            { value: "100%", label: "Free to use" },
            { value: "∞", label: "Subscriptions to track" },
            { value: "5min", label: "To get started" },
            { value: "0", label: "Hidden fees" },
          ].map((stat) => (
            <div key={stat.label} style={{
              padding: "32px 24px",
              textAlign: "center",
              background: "rgba(255,255,255,0.02)"
            }}>
              <p style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "36px",
                color: "white",
                marginBottom: "4px"
              }}>{stat.value}</p>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: "1100px", margin: "0 auto 100px", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(32px, 5vw, 48px)",
            color: "white",
            letterSpacing: "-1px",
            marginBottom: "16px"
          }}>
            Everything you need
          </h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "16px" }}>
            Built to give you complete control over your subscription spending
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "16px"
        }}>
          {[
            { icon: "📊", title: "Smart Dashboard", desc: "See your total monthly and yearly spend at a glance with beautiful interactive charts." },
            { icon: "🔔", title: "Renewal Alerts", desc: "Never get surprised by an auto-payment again. Know exactly when each subscription renews." },
            { icon: "💡", title: "Cost Suggestions", desc: "Get personalized tips to reduce spending, spot duplicates, and find free alternatives." },
            { icon: "📈", title: "Deep Analytics", desc: "Understand your spending patterns by category, billing cycle, and time period." },
            { icon: "🗂️", title: "Smart Categories", desc: "Organize subscriptions by Entertainment, Productivity, Health, and more." },
            { icon: "🔒", title: "Secure & Private", desc: "Your data is encrypted and private. Only you can see your subscriptions." },
          ].map((feature) => (
            <div key={feature.title} className="card-hover" style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "16px",
              padding: "28px"
            }}>
              <div className="feature-icon" style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                marginBottom: "16px"
              }}>
                {feature.icon}
              </div>
              <h3 style={{
                color: "white",
                fontSize: "16px",
                fontWeight: "600",
                marginBottom: "8px"
              }}>
                {feature.title}
              </h3>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", lineHeight: "1.6" }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="section-divider" style={{ maxWidth: "600px", margin: "0 auto 80px" }} />

      {/* CTA */}
      <div style={{ textAlign: "center", padding: "0 24px 100px" }}>
        <div style={{ maxWidth: "560px", margin: "0 auto" }}>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(32px, 5vw, 48px)",
            color: "white",
            letterSpacing: "-1px",
            marginBottom: "16px"
          }}>
            Ready to save money?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "16px", marginBottom: "40px" }}>
            Join and start tracking your subscriptions today. Completely free.
          </p>
          <Link href="/auth/signup" className="btn-primary" style={{
            color: "white",
            textDecoration: "none",
            fontSize: "16px",
            fontWeight: "600",
            padding: "16px 40px",
            borderRadius: "12px",
            display: "inline-block"
          }}>
            Get Started Free →
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "24px",
        textAlign: "center"
      }}>
        <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "13px" }}>
         © {new Date().getFullYear()} Kaisen. All rights reserved.
        </p>

      </div>

    </div>
  )
}