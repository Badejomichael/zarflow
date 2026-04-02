"use client";

import { motion } from "framer-motion";
import {
  RiWallet3Line,
  RiArrowUpLine,
  RiArrowDownLine,
  RiPercentLine,
} from "react-icons/ri";
import { useApp } from "@/app/context/AppContext";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

interface CardProps {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  accent: string;
  glow: string;
  delay: number;
  trend?: { positive: boolean; label: string };
}

function StatCard({
  label,
  value,
  sub,
  icon,
  accent,
  glow,
  delay,
  trend,
}: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #0d1421 100%)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "16px",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
        flex: 1,
        minWidth: "200px",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          top: "-30px",
          right: "-30px",
          width: "100px",
          height: "100px",
          background: `radial-gradient(circle, ${glow} 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Bottom accent line */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "24px",
          right: "24px",
          height: "1px",
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          opacity: 0.4,
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            padding: "8px",
            background: `linear-gradient(135deg, ${glow}, transparent)`,
            borderRadius: "10px",
            border: `1px solid ${accent}22`,
            color: accent,
          }}
        >
          {icon}
        </div>

        {trend && (
          <span
            style={{
              fontSize: "11px",
              fontFamily: "DM Mono, monospace",
              fontWeight: 500,
              color: trend.positive ? "#34d399" : "#f87171",
              background: trend.positive
                ? "rgba(52,211,153,0.1)"
                : "rgba(248,113,113,0.1)",
              padding: "3px 8px",
              borderRadius: "20px",
              border: `1px solid ${
                trend.positive
                  ? "rgba(52,211,153,0.2)"
                  : "rgba(248,113,113,0.2)"
              }`,
            }}
          >
            {trend.positive ? "+" : ""}
            {trend.label}
          </span>
        )}
      </div>

      <div>
        <p
          style={{
            fontSize: "11px",
            fontWeight: 500,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#475569",
            marginBottom: "6px",
            fontFamily: "DM Mono, monospace",
          }}
        >
          {label}
        </p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.2 }}
          style={{
            fontSize: "28px",
            fontWeight: 700,
            fontFamily: "Syne, sans-serif",
            color: "#f1f5f9",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
          }}
        >
          {value}
        </motion.p>

        {sub && (
          <p
            style={{
              fontSize: "12px",
              color: "#475569",
              marginTop: "4px",
              fontFamily: "DM Sans, sans-serif",
            }}
          >
            {sub}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default function SummaryCards() {
  const { totalBalance, totalIncome, totalExpenses, transactions } = useApp();

  const savingsRate =
    totalIncome > 0
      ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100)
      : 0;

  const cards: CardProps[] = [
    {
      label: "Total Balance",
      value: formatCurrency(totalBalance),
      sub: `Across ${transactions.length} transactions`,
      icon: <RiWallet3Line size={18} />,
      accent: "#22d3ee",
      glow: "rgba(34,211,238,0.12)",
      delay: 0,
      trend: {
        positive: totalBalance >= 0,
        label: totalBalance >= 0 ? "healthy" : "deficit",
      },
    },
    {
      label: "Total Income",
      value: formatCurrency(totalIncome),
      sub: `From ${
        transactions.filter((t) => t.type === "income").length
      } income records`,
      icon: <RiArrowUpLine size={18} />,
      accent: "#34d399",
      glow: "rgba(52,211,153,0.12)",
      delay: 0.08,
    },
    {
      label: "Total Expenses",
      value: formatCurrency(totalExpenses),
      sub: `From ${
        transactions.filter((t) => t.type === "expense").length
      } expense records`,
      icon: <RiArrowDownLine size={18} />,
      accent: "#f87171",
      glow: "rgba(248,113,113,0.12)",
      delay: 0.16,
    },
    {
      label: "Savings Rate",
      value: `${savingsRate}%`,
      sub:
        savingsRate >= 20
          ? "Above recommended 20%"
          : "Below recommended 20%",
      icon: <RiPercentLine size={18} />,
      accent: "#fbbf24",
      glow: "rgba(251,191,36,0.12)",
      delay: 0.24,
      trend: {
        positive: savingsRate >= 20,
        label: savingsRate >= 20 ? "on track" : "low",
      },
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "16px",
      }}
    >
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}