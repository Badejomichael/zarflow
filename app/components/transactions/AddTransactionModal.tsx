"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiCloseLine, RiCheckLine } from "react-icons/ri";
import { useApp } from "@/app/context/AppContext";
import { Transaction, Category, TransactionType } from "@/app/types";
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from "@/app/mock-data/mockData";

interface Props {
  open: boolean;
  onClose: () => void;
  editingTransaction?: Transaction | null;
}

const emptyForm = {
  date: new Date().toISOString().split("T")[0],
  amount: "",
  category: "Salary" as Category,
  type: "income" as TransactionType,
  description: "",
  merchant: "",
};

export default function AddTransactionModal({
  open,
  onClose,
  editingTransaction,
}: Props) {
  const { addTransaction, editTransaction } = useApp();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingTransaction) {
      setForm({
        date: editingTransaction.date,
        amount: String(editingTransaction.amount),
        category: editingTransaction.category,
        type: editingTransaction.type,
        description: editingTransaction.description,
        merchant: editingTransaction.merchant,
      });
    } else {
      setForm(emptyForm);
    }
    setError("");
  }, [editingTransaction, open]);

  const categories =
    form.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = () => {
    if (
      !form.date ||
      !form.amount ||
      !form.description ||
      !form.merchant
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    const amt = parseFloat(form.amount);
    if (isNaN(amt) || amt <= 0) {
      setError("Amount must be a positive number.");
      return;
    }

    const data = {
      date: form.date,
      amount: amt,
      category: form.category,
      type: form.type,
      description: form.description,
      merchant: form.merchant,
    };

    if (editingTransaction) {
      editTransaction(editingTransaction.id, data);
    } else {
      addTransaction(data);
    }

    onClose();
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    color: "#f1f5f9",
    fontSize: "14px",
    fontFamily: "DM Sans, sans-serif",
    padding: "10px 14px",
    width: "100%",
    outline: "none",
    transition: "border-color 0.2s ease",
  } as React.CSSProperties;

  const labelStyle = {
    display: "block",
    fontSize: "11px",
    fontFamily: "DM Mono, monospace",
    color: "#475569",
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    marginBottom: "6px",
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(4px)",
              zIndex: 100,
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 101,
              width: "100%",
              maxWidth: "460px",
              margin: "0 16px",
              background:
                "linear-gradient(135deg, #111827 0%, #0f172a 100%)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "20px",
              padding: "28px",
              boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <div>
                <h2
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#f1f5f9",
                  }}
                >
                  {editingTransaction
                    ? "Edit Transaction"
                    : "New Transaction"}
                </h2>
              </div>
              <button onClick={onClose}>
                <RiCloseLine size={18} />
              </button>
            </div>

            <div style={{ display: "grid", gap: "16px" }}>
              <input
                type="number"
                placeholder="Amount"
                value={form.amount}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    amount: e.target.value,
                  }))
                }
                style={inputStyle}
              />

              <input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    date: e.target.value,
                  }))
                }
                style={inputStyle}
              />

              <select
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    category: e.target.value as Category,
                  }))
                }
                style={inputStyle}
              >
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>

              <input
                placeholder="Merchant"
                value={form.merchant}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    merchant: e.target.value,
                  }))
                }
                style={inputStyle}
              />

              <input
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    description: e.target.value,
                  }))
                }
                style={inputStyle}
              />
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <button onClick={handleSubmit}>
              {editingTransaction ? "Save" : "Add"}
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}