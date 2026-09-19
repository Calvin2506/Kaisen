"use client"

const Badge = ({ children, variant = "neutral", className = "", icon, ...props }) => {
  const variants = {
    primary: "badge-primary",
    success: "badge-success",
    warning: "badge-warning",
    error: "badge-error",
    neutral: "badge-neutral",
  }

  return (
    <span className={`badge ${variants[variant]} ${className}`} {...props}>
      {icon && <span>{icon}</span>}
      {children}
    </span>
  )
}

export default Badge