"use client";

import { countries } from "@/lib/countries";

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function CountrySelect({
  value,
  onChange,
  className,
}: CountrySelectProps) {
  return (
    <div className={className}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border border-border rounded-lg px-4 py-3 text-foreground text-lg appearance-none cursor-pointer focus:outline-none focus:border-foreground/40"
      >
        <option value="" disabled>
          Select a country...
        </option>
        {countries.map((c) => (
          <option key={c.code} value={c.code}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
