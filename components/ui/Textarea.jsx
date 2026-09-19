"use client"

import { forwardRef } from "react"

const Textarea = forwardRef(
  ({ label, error, className = "", id, rows = 3, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-")

    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label htmlFor={textareaId} className="label-base">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={`input-base resize-none ${error ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20" : ""}`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${textareaId}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${textareaId}-error`} className="mt-2 text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = "Textarea"

export default Textarea