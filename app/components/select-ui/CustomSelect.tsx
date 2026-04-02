"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiArrowDownSLine, RiCheckLine } from "react-icons/ri";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Select...",
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? placeholder;

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
          padding: "8px 12px",
          background: open
            ? "rgba(34,211,238,0.06)"
            : "rgba(255,255,255,0.04)",
          border: open
            ? "1px solid rgba(34,211,238,0.3)"
            : "1px solid rgba(255,255,255,0.08)",
          borderRadius: "8px",
          color: "#f1f5f9",
          fontSize: "13px",
          fontFamily: "DM Sans, sans-serif",
          cursor: "pointer",
          textAlign: "left",
          transition: "all 0.2s ease",
          outline: "none",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            color: value ? "#f1f5f9" : "#475569",
            flex: 1,
            minWidth: 0,
          }}
        >
          {selectedLabel}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          style={{ flexShrink: 0, color: open ? "#22d3ee" : "#475569", display: "flex" }}
        >
          <RiArrowDownSLine size={16} />
        </motion.span>
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -6, scaleY: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              left: 0,
              right: 0,
              zIndex: 200,
              background: "#111827",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "10px",
              boxShadow:
                "0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(34,211,238,0.06)",
              overflow: "hidden",
              transformOrigin: "top",
            }}
          >
            {/* Inner scroll container */}
            <div
              style={{
                maxHeight: "220px",
                overflowY: "auto",
                padding: "6px",
              }}
            >
              {options.map((opt) => {
                const active = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "8px",
                      padding: "8px 10px",
                      borderRadius: "7px",
                      border: "none",
                      background: active
                        ? "rgba(34,211,238,0.1)"
                        : "transparent",
                      color: active ? "#22d3ee" : "#94a3b8",
                      fontSize: "13px",
                      fontFamily: "DM Sans, sans-serif",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.12s ease",
                      fontWeight: active ? 500 : 400,
                    }}
                    onMouseEnter={(e) => {
                      if (!active)
                        (e.currentTarget as HTMLElement).style.background =
                          "rgba(255,255,255,0.04)";
                      (e.currentTarget as HTMLElement).style.color = "#f1f5f9";
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        (e.currentTarget as HTMLElement).style.background =
                          "transparent";
                        (e.currentTarget as HTMLElement).style.color =
                          "#94a3b8";
                      }
                    }}
                  >
                    <span>{opt.label}</span>
                    {active && (
                      <RiCheckLine
                        size={13}
                        style={{ flexShrink: 0, color: "#22d3ee" }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
