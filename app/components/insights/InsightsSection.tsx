"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  RiFireLine,
  RiArrowUpLine,
  RiArrowDownLine,
  RiLightbulbLine,
  RiTrophyLine,
} from "react-icons/ri";
import { useApp } from "@/app/context/AppContext";
import { CATEGORY_COLORS } from "@/app/mock-data/mockData";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(n);
}

function CustomBarTooltip({ active, payload, label }: any) {
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
      <p style={{ fontSize: "11px", color: "#475569", marginBottom: "6px" }}>
        {label}
      </p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ fontSize: "14px", fontWeight: 600, color: p.fill }}>
          {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
}

interface InsightCardProps {
  title: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  accent: string;
  glow: string;
  delay: number;
}

function InsightCard({ title, value, sub, icon, accent, glow, delay }: InsightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45 }}
      whileHover={{ y: -2 }}
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #0d1421 100%)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "16px",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-20px",
          right: "-20px",
          width: "100px",
          height: "100px",
          background: `radial-gradient(circle, ${glow} 0%, transparent 70%)`,
        }}
      />
      <div
        style={{
          padding: "8px",
          background: glow,
          borderRadius: "10px",
          color: accent,
          marginBottom: "16px",
        }}
      >
        {icon}
      </div>

      <p style={{ fontSize: "10px", color: "#475569" }}>{title}</p>
      <p style={{ fontSize: "22px", fontWeight: 700, color: "#f1f5f9" }}>{value}</p>
      <p style={{ fontSize: "12px", color: "#334155" }}>{sub}</p>
    </motion.div>
  );
}

export default function InsightsSection() {
  const { categoryBreakdown, monthlySummaries, totalIncome, totalExpenses } = useApp();

  const topExpenseCat = categoryBreakdown
    .filter((c) => !["Salary", "Freelance", "Investment"].includes(c.category))
    .sort((a, b) => b.amount - a.amount)[0];

  const bestMonth = [...monthlySummaries].sort((a, b) => b.balance - a.balance)[0];

  const worstMonth = [...monthlySummaries].sort((a, b) => b.expenses - a.expenses)[0];

  const avgExpense =
    monthlySummaries.length > 0
      ? monthlySummaries.reduce((s, m) => s + m.expenses, 0) / monthlySummaries.length
      : 0;

  const savingsRate =
    totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  const insights = [
    topExpenseCat && {
      title: "Top Spending Category",
      value: topExpenseCat.category,
      sub: `${formatCurrency(topExpenseCat.amount)} - ${topExpenseCat.percentage.toFixed(1)}% of total`,
      icon: <RiFireLine size={18} />,
      accent: "#f87171",
      glow: "rgba(248,113,113,0.12)",
      delay: 0,
    },
    bestMonth && {
      title: "Best Saving Month",
      value: bestMonth.month,
      sub: `Saved ${formatCurrency(bestMonth.balance)} that month`,
      icon: <RiTrophyLine size={18} />,
      accent: "#34d399",
      glow: "rgba(52,211,153,0.12)",
      delay: 0.08,
    },
    worstMonth && {
      title: "Highest Spending Month",
      value: worstMonth.month,
      sub: `Spent ${formatCurrency(worstMonth.expenses)} in expenses`,
      icon: <RiArrowDownLine size={18} />,
      accent: "#fbbf24",
      glow: "rgba(251,191,36,0.12)",
      delay: 0.16,
    },
    {
      title: "Avg Monthly Expense",
      value: formatCurrency(avgExpense),
      sub: `Based on ${monthlySummaries.length} months`,
      icon: <RiLightbulbLine size={18} />,
      accent: "#22d3ee",
      glow: "rgba(34,211,238,0.12)",
      delay: 0.24,
    },
    {
      title: "Savings Rate",
      value: `${savingsRate.toFixed(1)}%`,
      sub:
        savingsRate >= 20
          ? "Exceeding recommended 20%"
          : "Below recommended 20%",
      icon: <RiArrowUpLine size={18} />,
      accent: savingsRate >= 20 ? "#34d399" : "#f87171",
      glow:
        savingsRate >= 20
          ? "rgba(52,211,153,0.12)"
          : "rgba(248,113,113,0.12)",
      delay: 0.32,
    },
  ].filter(Boolean) as InsightCardProps[];

  return (
    <div>
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        {insights.map((card) => (
          <InsightCard key={card.title} {...card} />
        ))}
      </div>

      {/* Observations */}
      <div style={{ marginTop: "24px" }}>
        {[
          topExpenseCat &&
            `Your largest expense category is ${topExpenseCat.category}, accounting for ${topExpenseCat.percentage.toFixed(
              1
            )}% (${formatCurrency(topExpenseCat.amount)}).`,
          bestMonth &&
            `Best saving month was ${bestMonth.month} with ${formatCurrency(
              bestMonth.balance
            )} saved.`,
          savingsRate >= 20
            ? `Savings rate is ${savingsRate.toFixed(1)}% - great job.`
            : `Savings rate is ${savingsRate.toFixed(1)}% - needs improvement.`,
        ]
          .filter(Boolean)
          .map((obs, i) => (
            <p key={i}>{obs}</p>
          ))}
      </div>
    </div>
  );
}