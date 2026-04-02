"use client";

import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useApp } from "@/app/context/AppContext";

function formatK(n: number) {
  if (Math.abs(n) >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return `${n}`;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#111827",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "10px",
        padding: "12px 16px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
      }}
    >
      <p
        style={{
          fontFamily: "DM Mono, monospace",
          fontSize: "11px",
          color: "#475569",
          marginBottom: "8px",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </p>
      {payload.map((p: any) => (
        <div
          key={p.dataKey}
          style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: p.color,
            }}
          />
          <span
            style={{
              fontFamily: "DM Mono, monospace",
              fontSize: "12px",
              color: "#94a3b8",
              textTransform: "capitalize",
            }}
          >
            {p.name}:
          </span>
          <span
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "13px",
              fontWeight: 600,
              color: p.color,
            }}
          >
            {formatK(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function BalanceTrendChart() {
  const { monthlySummaries } = useApp();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #0d1421 100%)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "16px",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "300px",
          height: "200px",
          background: "radial-gradient(ellipse, rgba(34,211,238,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ marginBottom: "20px" }}>
        <h3
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "15px",
            fontWeight: 700,
            color: "#f1f5f9",
            letterSpacing: "-0.02em",
            marginBottom: "4px",
          }}
        >
          Balance Trend
        </h3>
        <p style={{ fontSize: "12px", color: "#475569", fontFamily: "DM Sans, sans-serif" }}>
          Monthly income, expenses and net balance
        </p>
      </div>

      {monthlySummaries.length === 0 ? (
        <div
          style={{
            height: "240px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#334155",
            fontFamily: "DM Mono, monospace",
            fontSize: "13px",
          }}
        >
          No data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={monthlySummaries} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f87171" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{
                fill: "#475569",
                fontSize: 11,
                fontFamily: "DM Mono, monospace",
              }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatK}
              tick={{
                fill: "#475569",
                fontSize: 10,
                fontFamily: "DM Mono, monospace",
              }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                paddingTop: "16px",
                fontFamily: "DM Mono, monospace",
                fontSize: "11px",
                color: "#64748b",
              }}
            />
            <Area
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="#34d399"
              strokeWidth={2}
              fill="url(#incomeGrad)"
              dot={false}
              activeDot={{ r: 4, fill: "#34d399", strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              name="Expenses"
              stroke="#f87171"
              strokeWidth={2}
              fill="url(#expenseGrad)"
              dot={false}
              activeDot={{ r: 4, fill: "#f87171", strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="balance"
              name="Balance"
              stroke="#22d3ee"
              strokeWidth={2}
              fill="url(#balanceGrad)"
              dot={false}
              activeDot={{ r: 4, fill: "#22d3ee", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
}