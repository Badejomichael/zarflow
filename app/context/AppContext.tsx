"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import {
  Transaction,
  Role,
  FilterState,
  MonthlySummary,
  CategoryBreakdown,
  Category,
} from "@/app/types";
import { mockTransactions, CATEGORY_COLORS } from "@/app/mock-data/mockData";

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;

  transactions: Transaction[];
  addTransaction: (t: Omit<Transaction, "id">) => void;
  editTransaction: (id: string, t: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  filters: FilterState;
  setFilters: (f: Partial<FilterState>) => void;
  resetFilters: () => void;
  filteredTransactions: Transaction[];

  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  monthlySummaries: MonthlySummary[];
  categoryBreakdown: CategoryBreakdown[];

  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const defaultFilters: FilterState = {
  search: "",
  type: "all",
  category: "all",
  sortField: "date",
  sortDirection: "desc",
  dateFrom: "",
  dateTo: "",
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>("admin");

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("fd_transactions");
      if (saved) return JSON.parse(saved);
    }
    return mockTransactions;
  });

  const [filters, setFiltersState] = useState<FilterState>(defaultFilters);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Persist transactions
  useEffect(() => {
    localStorage.setItem("fd_transactions", JSON.stringify(transactions));
  }, [transactions]);

  const setFilters = useCallback((f: Partial<FilterState>) => {
    setFiltersState((prev) => ({ ...prev, ...f }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(defaultFilters);
  }, []);

  // ✅ FIXED: template literal
  const addTransaction = useCallback((t: Omit<Transaction, "id">) => {
    const newT: Transaction = { ...t, id: `t_${Date.now()}` };
    setTransactions((prev) => [newT, ...prev]);
  }, []);

  const editTransaction = useCallback(
    (id: string, updates: Partial<Transaction>) => {
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
      );
    },
    []
  );

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.merchant.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }

    if (filters.type !== "all") {
      result = result.filter((t) => t.type === filters.type);
    }

    if (filters.category !== "all") {
      result = result.filter((t) => t.category === filters.category);
    }

    if (filters.dateFrom) {
      result = result.filter((t) => t.date >= filters.dateFrom);
    }

    if (filters.dateTo) {
      result = result.filter((t) => t.date <= filters.dateTo);
    }

    result.sort((a, b) => {
      let valA: string | number = a[filters.sortField];
      let valB: string | number = b[filters.sortField];

      if (filters.sortField === "amount") {
        valA = Number(valA);
        valB = Number(valB);
      } else {
        valA = String(valA).toLowerCase();
        valB = String(valB).toLowerCase();
      }

      if (valA < valB) return filters.sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return filters.sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [transactions, filters]);

  const totalIncome = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "income")
        .reduce((s, t) => s + t.amount, 0),
    [transactions]
  );

  const totalExpenses = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "expense")
        .reduce((s, t) => s + t.amount, 0),
    [transactions]
  );

  const totalBalance = totalIncome - totalExpenses;

  // ✅ FIXED: template literal
  const monthlySummaries = useMemo((): MonthlySummary[] => {
    const months: Record<
      string,
      { income: number; expenses: number; label: string }
    > = {};

    transactions.forEach((t) => {
      const date = new Date(t.date);

      const key = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      const label = date.toLocaleString("default", { month: "short" });

      if (!months[key]) months[key] = { income: 0, expenses: 0, label };

      if (t.type === "income") months[key].income += t.amount;
      else months[key].expenses += t.amount;
    });

    return Object.entries(months)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => ({
        month: v.label,
        income: v.income,
        expenses: v.expenses,
        balance: v.income - v.expenses,
      }));
  }, [transactions]);

  const categoryBreakdown = useMemo((): CategoryBreakdown[] => {
    const catTotals: Record<string, number> = {};

    const expenseTotal = transactions
      .filter((t) => t.type === "expense")
      .reduce((s, t) => {
        catTotals[t.category] =
          (catTotals[t.category] || 0) + t.amount;
        return s + t.amount;
      }, 0);

    return Object.entries(catTotals)
      .map(([cat, amount]) => ({
        category: cat as Category,
        amount,
        percentage:
          expenseTotal > 0 ? (amount / expenseTotal) * 100 : 0,
        color: CATEGORY_COLORS[cat] || "#64748b",
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        transactions,
        addTransaction,
        editTransaction,
        deleteTransaction,
        filters,
        setFilters,
        resetFilters,
        filteredTransactions,
        totalBalance,
        totalIncome,
        totalExpenses,
        monthlySummaries,
        categoryBreakdown,
        activeTab,
        setActiveTab,
        sidebarOpen,
        setSidebarOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}