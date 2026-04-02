"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  RiDashboardLine,
  RiExchangeDollarLine,
  RiBarChartBoxLine,
  RiCloseLine,
  RiPulseLine,
} from "react-icons/ri";
import { useApp } from "@/app/context/AppContext";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: RiDashboardLine },
  { id: "transactions", label: "Transactions", icon: RiExchangeDollarLine },
  { id: "insights", label: "Insights", icon: RiBarChartBoxLine },
];

export default function Sidebar() {
  const { activeTab, setActiveTab, sidebarOpen, setSidebarOpen } = useApp();

  const handleNav = (id: string) => {
    setActiveTab(id);
    setSidebarOpen(false);
  };

  const SidebarContent = () => (
    <div
      style={{
        width: "240px",
        height: "100vh",
        background: "linear-gradient(180deg, #0d1421 0%, #080c14 100%)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        padding: "0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow top */}
      <div
        style={{
          position: "absolute",
          top: "-60px",
          left: "-60px",
          width: "200px",
          height: "200px",
          background: "radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Logo */}
      <div
        style={{
          padding: "28px 24px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              background: "linear-gradient(135deg, #22d3ee, #0891b2)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 16px rgba(34,211,238,0.3)",
            }}
          >
            <RiPulseLine size={18} color="#fff" />
          </div>
          <span
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "18px",
              fontWeight: 700,
              color: "#f1f5f9",
              letterSpacing: "-0.02em",
            }}
          >
            Fin<span style={{ color: "#22d3ee" }}>Flow</span>
          </span>
        </div>
      </div>

      {/* Nav label */}
      <div
        style={{
          padding: "20px 24px 8px",
        }}
      >
        <span
          style={{
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#475569",
            fontFamily: "DM Mono, monospace",
          }}
        >
          Navigation
        </span>
      </div>

      {/* Nav items */}
      <nav style={{ padding: "0 12px", flex: 1 }}>
        {navItems.map((item) => {
          const active = activeTab === item.id;
          const Icon = item.icon;
          return (
            <motion.button
              key={item.id}
              onClick={() => handleNav(item.id)}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 12px",
                marginBottom: "2px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                background: active
                  ? "linear-gradient(90deg, rgba(34,211,238,0.12) 0%, rgba(34,211,238,0.04) 100%)"
                  : "transparent",
                color: active ? "#22d3ee" : "#64748b",
                borderLeft: active ? "2px solid #22d3ee" : "2px solid transparent",
                transition: "all 0.2s ease",
                textAlign: "left",
                fontSize: "14px",
                fontWeight: active ? 500 : 400,
                fontFamily: "DM Sans, sans-serif",
                letterSpacing: "-0.01em",
              }}
            >
              <Icon size={16} />
              {item.label}
            </motion.button>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: "16px 24px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <p
          style={{
            fontSize: "11px",
            color: "#334155",
            fontFamily: "DM Mono, monospace",
          }}
        >
          v1.0.0 - 2025
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div
        className="hidden md:block"
        style={{ position: "fixed", top: 0, left: 0, zIndex: 30, height: "100vh" }}
      >
        <SidebarContent />
      </div>

      {/* Mobile overlay sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.6)",
                zIndex: 40,
              }}
            />
            <motion.div
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: 50,
              }}
            >
              <SidebarContent />
              <button
                onClick={() => setSidebarOpen(false)}
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "-40px",
                  background: "rgba(15,23,42,0.9)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  padding: "6px",
                  color: "#94a3b8",
                  cursor: "pointer",
                }}
              >
                <RiCloseLine size={18} />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}