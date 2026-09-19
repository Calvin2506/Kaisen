"use client";

import { useState } from "react";

const SIZE = { sm: 28, md: 40, lg: 56, xl: 64 };

export default function PlatformIcon({ platform, size = "md", className = "" }) {
  const [failed, setFailed] = useState(false);
  const px = SIZE[size] || SIZE.md;
  const box = px + (size === "sm" ? 12 : 16);
  const id = platform?.id || platform?.icon || "manual";
  const name = platform?.name || id;
  const src = `/brands/${id}.png`;

  return (
    <span
      className={`inline-flex items-center justify-center rounded-2xl shrink-0 overflow-hidden bg-white ${className}`}
      style={{
        width: box,
        height: box,
        boxShadow: "0 10px 24px rgba(0,0,0,0.28)",
      }}
      aria-hidden="true"
    >
      {!failed ? (
        <img
          src={src}
          alt=""
          width={px}
          height={px}
          className="w-[72%] h-[72%] object-contain"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="text-slate-800 text-sm font-bold">
          {String(name).slice(0, 1).toUpperCase()}
        </span>
      )}
    </span>
  );
}
