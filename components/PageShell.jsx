export function LoadingScreen({ label = "Loading..." }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#07080d]">
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border border-white/10" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-400 animate-spin" />
        </div>
        <p className="text-white/40 text-sm">{label}</p>
      </div>
    </div>
  )
}

export default function PageShell({ children, className = "", contained = true }) {
  return (
    <div className={`min-h-screen relative ${className}`}>
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#07080d]">
        <div className="aurora-orb aurora-orb-a" />
        <div className="aurora-orb aurora-orb-b" />
        <div className="aurora-orb aurora-orb-c" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05),transparent_55%)]" />
        <div className="noise-overlay" />
      </div>
      <div className={`relative animate-page-in ${contained ? "section-container py-8 lg:py-10" : ""}`}>
        {children}
      </div>
    </div>
  )
}
