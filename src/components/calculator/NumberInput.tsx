"use client";

import { useState, useRef, useEffect } from "react";

interface NumberInputProps {
  value: number | null;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  placeholder?: string;
  className?: string;
}

export function NumberInput({
  value,
  onChange,
  min,
  max,
  step,
  placeholder,
  className,
}: NumberInputProps) {
  const ref = useRef<HTMLInputElement>(null);
  const [text, setText] = useState(value !== null ? String(value) : "");

  useEffect(() => {
    ref.current?.focus();
  }, []);

  // Sync external value changes
  useEffect(() => {
    if (value !== null && String(value) !== text) {
      setText(String(value));
    }
  }, [value]);

  return (
    <div className={className}>
      <input
        ref={ref}
        type="text"
        inputMode="decimal"
        value={text}
        placeholder={placeholder ?? String(min)}
        onChange={(e) => {
          const raw = e.target.value;
          // Accept digits, dots, and commas (comma = decimal on some locales/keyboards)
          if (raw === "" || /^[\d.,]*$/.test(raw)) {
            setText(raw);
            const normalized = raw.replace(",", ".");
            const v = step && step < 1 ? parseFloat(normalized) : parseInt(normalized, 10);
            if (!isNaN(v) && v >= min && v <= max) {
              onChange(v);
            }
          }
        }}
        onBlur={() => {
          // Clamp and format on blur
          const normalized = text.replace(",", ".");
          const v = step && step < 1 ? parseFloat(normalized) : parseInt(normalized, 10);
          if (!isNaN(v)) {
            const clamped = Math.min(max, Math.max(min, v));
            setText(step && step < 1 ? clamped.toFixed(1) : String(clamped));
            onChange(clamped);
          } else {
            setText("");
          }
        }}
        className="w-32 bg-transparent border-b-2 border-foreground text-4xl font-serif text-center focus:outline-none tabular-nums"
      />
    </div>
  );
}
