"use client"

import { forwardRef } from "react"

const Select = forwardRef(
  ({ label, error, className = "", id, options = [], placeholder, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-")

    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label htmlFor={selectId} className="label-base">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`input-base ${error ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20" : ""} appearance-none bg-[url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%239ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>')] bg-[right_12px_center] bg-no-repeat pr-10`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${selectId}-error` : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p id={`${selectId}-error`} className="mt-2 text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Select.displayName = "Select"

export default Select