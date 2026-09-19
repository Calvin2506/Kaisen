"use client"

import { forwardRef } from "react"

const Card = forwardRef(
  ({ children, className = "", variant = "default", interactive = false, ...props }, ref) => {
    const variants = {
      default: "card-base",
      interactive: "card-interactive",
      glass: "glass",
      "glass-strong": "glass-strong",
    }

    return (
      <div
        ref={ref}
        className={`${variants[variant]} ${interactive ? "card-interactive" : ""} ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = "Card"

export const CardHeader = forwardRef(({ children, className = "", ...props }, ref) => (
  <div ref={ref} className={`px-6 py-5 border-b border-white/5 ${className}`} {...props}>
    {children}
  </div>
))

CardHeader.displayName = "CardHeader"

export const CardContent = forwardRef(({ children, className = "", ...props }, ref) => (
  <div ref={ref} className={`p-6 ${className}`} {...props}>
    {children}
  </div>
))

CardContent.displayName = "CardContent"

export const CardFooter = forwardRef(({ children, className = "", ...props }, ref) => (
  <div ref={ref} className={`px-6 py-5 border-t border-white/5 ${className}`} {...props}>
    {children}
  </div>
))

CardFooter.displayName = "CardFooter"

export default Card