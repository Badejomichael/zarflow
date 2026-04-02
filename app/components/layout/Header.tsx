"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiMenuLine,
  RiShieldUserLine,
  RiEyeLine,
  RiArrowDownSLine,
  RiCheckLine,
} from "react-icons/ri";
import { useApp } from "@/app/context/AppContext";
import { Role } from "@/app/types";

const tabs = [
  { id: "dashboard", label: "Dashboard" },
  { id: "transactions", label: "Transactions" },
  { id: "insights", label: "Insights" },
];

const roleOptions: { value: Role; label: string }[] = [
  { value: "admin", label: "ADMIN" },
  { value: "viewer", label: "VIEWER" },
];

function RoleDropdown({
  role,
  setRole,
}: {
  role: Role;
  setRole: (r: Role) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const isAdmin = role === "admin";

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "7px",
          padding: "6px 10px",
          background: open
            ? isAdmin
              ? "rgba(34,211,238,0.08)"
              : "rgba(255,255,255,0.06)"
            : "rgba(255,255,255,0.04)",
          border: open
            ? isAdmin
              ? "1px solid rgba(34,211,238,0.3)"
              : "1px solid rgba(255,255,255,0.15)"
            : "1px solid rgba(255,255,255,0.08)",
          borderRadius: "8px",
          cursor: "pointer",
          outline: "none",
          transition: "all 0.2s ease",
        }}
      >
        {isAdmin ? (
          <RiShieldUserLine size={14} color="#22d3ee" />
        ) : (
          <RiEyeLine size={14} color="#94a3b8" />
        )}

        <span
          style={{
            fontSize: "12px",
            fontWeight: 500,
            fontFamily: "DM Mono, monospace",
            letterSpacing: "0.06em",
            color: isAdmin ? "#22d3ee" : "#94a3b8",
            transition: "color 0.2s ease",
          }}
        >
          {role.toUpperCase()}
        </span>

        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          style={{
            display: "flex",
            color: open
              ? isAdmin
                ? "#22d3ee"
                : "#94a3b8"
              : "#334155",
          }}
        >
          <RiArrowDownSLine size={14} />
        </motion.span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scaleY: 0.92 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -6, scaleY: 0.92 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              right: 0,
              zIndex: 300,
              background: "#111827",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "10px",
              boxShadow:
                "0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(34,211,238,0.06)",
              overflow: "hidden",
              transformOrigin: "top right",
              minWidth: "140px",
              padding: "6px",
            }}
          >
            {roleOptions.map((opt) => {
              const active = opt.value === role;
              const optAdmin = opt.value === "admin";
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setRole(opt.value);
                    setOpen(false);
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "10px",
                    padding: "9px 12px",
                    borderRadius: "7px",
                    border: "none",
                    background: active
                      ? optAdmin
                        ? "rgba(34,211,238,0.1)"
                        : "rgba(148,163,184,0.08)"
                      : "transparent",
                    cursor: "pointer",
                    transition: "all 0.12s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!active)
                      (e.currentTarget as HTMLElement).style.background =
                        "rgba(255,255,255,0.04)";
                  }}
                  onMouseLeave={(e) => {
                    if (!active)
                      (e.currentTarget as HTMLElement).style.background =
                        "transparent";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {optAdmin ? (
                      <RiShieldUserLine
                        size={13}
                        color={active ? "#22d3ee" : "#475569"}
                      />
                    ) : (
                      <RiEyeLine
                        size={13}
                        color={active ? "#94a3b8" : "#475569"}
                      />
                    )}
                    <span
                      style={{
                        fontSize: "12px",
                        fontFamily: "DM Mono, monospace",
                        fontWeight: active ? 600 : 400,
                        letterSpacing: "0.06em",
                        color: active
                          ? optAdmin
                            ? "#22d3ee"
                            : "#94a3b8"
                          : "#64748b",
                        transition: "color 0.12s ease",
                      }}
                    >
                      {opt.label}
                    </span>
                  </div>
                  {active && (
                    <RiCheckLine
                      size={13}
                      color={optAdmin ? "#22d3ee" : "#94a3b8"}
                    />
                  )}
                </button>
              );
            })}

            {/* Role description */}
            <div
              style={{
                margin: "6px 6px 2px",
                padding: "8px 10px",
                background: "rgba(255,255,255,0.02)",
                borderRadius: "6px",
                borderTop: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <p
                style={{
                  fontSize: "10px",
                  fontFamily: "DM Mono, monospace",
                  color: "#334155",
                  lineHeight: 1.5,
                  letterSpacing: "0.02em",
                }}
              >
                {role === "admin"
                  ? "Can add, edit & delete transactions"
                  : "Read-only access to all data"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Header() {
  const { role, setRole, setSidebarOpen, activeTab, setActiveTab } = useApp();

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        left: "0",
        zIndex: 20,
        height: "64px",
        background: "rgba(8,12,20,0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        alignItems: "center",
        paddingRight: "24px",
      }}
      className="md:!pl-[240px]"
    >
      {/* Mobile menu trigger */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:!hidden"
        style={{
          marginLeft: "16px",
          marginRight: "12px",
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "8px",
          padding: "8px",
          color: "#94a3b8",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
        }}
      >
        <RiMenuLine size={18} />
      </button>

      {/* Tab navigation — desktop */}
      <div
        className="hidden md:flex"
        style={{
          flex: 1,
          paddingLeft: "32px",
          gap: "4px",
          position: "relative",
        }}
      >
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileTap={{ scale: 0.96 }}
              style={{
                padding: "6px 14px",
                borderRadius: "6px",
                border: "none",
                background: active ? "rgba(34,211,238,0.1)" : "transparent",
                color: active ? "#22d3ee" : "#64748b",
                fontSize: "13px",
                fontWeight: active ? 500 : 400,
                fontFamily: "DM Sans, sans-serif",
                cursor: "pointer",
                transition: "all 0.2s ease",
                letterSpacing: "-0.01em",
                position: "relative",
              }}
            >
              {tab.label}
              {active && (
                <motion.div
                  layoutId="tab-indicator"
                  style={{
                    position: "absolute",
                    bottom: "-1px",
                    left: "14px",
                    right: "14px",
                    height: "2px",
                    background: "#22d3ee",
                    borderRadius: "1px",
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Mobile title */}
      <div className="flex md:hidden" style={{ flex: 1 }}>
        <span
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "16px",
            fontWeight: 700,
            color: "#f1f5f9",
          }}
        >
          Fin<span style={{ color: "#22d3ee" }}>Flow</span>
        </span>
      </div>

      {/* Role dropdown */}
      <RoleDropdown role={role} setRole={setRole} />
    </header>
  );
}
