"use client";

import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useApp } from "@/app/context/AppContext";

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
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
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: d.color }} />
        <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "13px", color: "#f1f5f9", fontWeight: 500 }}>
          {d.category}
        </p>
      </div>
      <p style={{ fontFamily: "DM Mono, monospace", fontSize: "12px", color: "#94a3b8" }}>
        <span style={{ color: d.color, fontWeight: 600 }}>
          ${d.amount.toLocaleString()}
        </span>
        {" "}— {d.percentage.toFixed(1)}%
      </p>
    </div>
  );
}

function CustomLegend({ data }: { data: any[] }) {
  const top = data.slice(0, 6);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {top.map((item) => (
        <div key={item.category} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "3px",
              background: item.color,
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center", minWidth: 0 }}>
            <span
              style={{
                fontSize: "12px",
                color: "#64748b",
                fontFamily: "DM Sans, sans-serif",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                marginRight: "8px",
              }}
            >
              {item.category}
            </span>
            <span
              style={{
                fontSize: "11px",
                color: "#94a3b8",
                fontFamily: "DM Mono, monospace",
                flexShrink: 0,
              }}
            >
              {item.percentage.toFixed(1)}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SpendingBreakdownChart() {
  const { categoryBreakdown, totalExpenses } = useApp();
  const expenseData = categoryBreakdown.filter((c) =>
    !["Salary", "Freelance", "Investment"].includes(c.category)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #0d1421 100%)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "16px",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
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
          Spending Breakdown
        </h3>
        <p style={{ fontSize: "12px", color: "#475569", fontFamily: "DM Sans, sans-serif" }}>
          Distribution by category
        </p>
      </div>

      {expenseData.length === 0 ? (
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
            No expense data available
        </div>
      ) : (
        <div style={{ display: "flex", gap: "24px", alignItems: "center", flexWrap: "wrap" }}>
          {/* Donut chart */}
          <div style={{ position: "relative", width: "180px", height: "180px", flexShrink: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="amount"
                  strokeWidth={0}
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} opacity={0.9} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#f1f5f9",
                  lineHeight: 1,
                }}
              >
                ${(totalExpenses / 1000).toFixed(1)}k
              </p>
              <p
                style={{
                  fontFamily: "DM Mono, monospace",
                  fontSize: "9px",
                  color: "#475569",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginTop: "4px",
                }}
              >
                Total
              </p>
            </div>
          </div>

          {/* Legend */}
          <div style={{ flex: 1, minWidth: "120px" }}>
            <CustomLegend data={expenseData} />
          </div>
        </div>
      )}
    </motion.div>
  );
}