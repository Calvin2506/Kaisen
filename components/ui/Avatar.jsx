"use client"

const Avatar = ({ name, size = "md", className = "", src, alt }) => {
  const sizes = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-xl",
  }

  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const colors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-cyan-500",
    "bg-red-500",
    "bg-orange-500",
  ]

  const colorIndex = name
    ? name.charCodeAt(0) % colors.length
    : 0

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name}
        className={`${sizes[size]} rounded-full object-cover ${className}`}
      />
    )
  }

  return (
    <div
      className={`${sizes[size]} rounded-full ${colors[colorIndex]} flex items-center justify-center font-semibold text-white ${className}`}
      aria-label={name}
    >
      {initials}
    </div>
  )
}

export default Avatar