"use client";

import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/app/components/layout/Sidebar";
import Header from "@/app/components/layout/Header";
import SummaryCards from "@/app/components/dashboard/SummaryCards";
import BalanceTrendChart from "@/app/components/dashboard/BalanceTrendChart";
import SpendingBreakdownChart from "@/app/components/dashboard/SpendingBreakdownChart";
import TransactionFilters from "@/app/components/transactions/TransactionFilters";
import TransactionTable from "@/app//components/transactions/TransactionTable";
import InsightsSection from "@/app/components/insights/InsightsSection";
import { useApp } from "@/app/context/AppContext";

function PageTitle({ title, sub }: { title: string; sub: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ marginBottom: "24px" }}
    >
      <h1
        style={{
          fontFamily: "Syne, sans-serif",
          fontSize: "26px",
          fontWeight: 800,
          color: "#f1f5f9",
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
          marginBottom: "4px",
        }}
      >
        {title}
      </h1>
      <p
        style={{
          fontSize: "13px",
          color: "#475569",
          fontFamily: "DM Sans, sans-serif",
        }}
      >
        {sub}
      </p>
    </motion.div>
  );
}

function DashboardView() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <PageTitle
        title="Financial Overview"
        sub="Your personal finance summary at a glance"
      />
      <SummaryCards />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "20px",
        }}
      >
        <BalanceTrendChart />
        <SpendingBreakdownChart />
      </div>
    </div>
  );
}

function TransactionsView() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <PageTitle
        title="Transactions"
        sub="Browse, filter, and manage all your financial records"
      />
      <TransactionFilters />
      <TransactionTable />
    </div>
  );
}

function InsightsView() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <PageTitle
        title="Insights"
        sub="Patterns and observations drawn from your financial data"
      />
      <InsightsSection />
    </div>
  );
}

export default function Home() {
  const { activeTab } = useApp();

  const views: Record<string, React.ReactNode> = {
    dashboard: <DashboardView />,
    transactions: <TransactionsView />,
    insights: <InsightsView />,
  };

  return (
    <div
      className="bg-grid"
      style={{
        minHeight: "100vh",
        background: "#080c14",
        display: "flex",
      }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div
        style={{
          flex: 1,
          paddingTop: "64px",
          minWidth: 0,
        }}
        className="ml-0 md:!ml-[240px]"
      >
        
        <Header />

        <main
          style={{
            padding: "32px 24px",
            maxWidth: "1200px",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {views[activeTab] ?? <DashboardView />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}