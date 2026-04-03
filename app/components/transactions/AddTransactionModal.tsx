"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiCloseLine, RiCheckLine, RiArrowDownSLine } from "react-icons/ri";
import { useApp } from "@/app/context/AppContext";
import { Transaction, Category, TransactionType } from "@/app/types";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/app/mock-data/mockData";

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

// Category dropdown
function CategorySelect({
  value,
  onChange,
  categories,
}: {
  value: Category;
  onChange: (v: Category) => void;
  categories: Category[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
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

  return (
    <div ref={ref} style={{ position: "relative", width: "100%", zIndex: 10 }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
          padding: "10px 14px",
          background: open ? "rgba(34,211,238,0.06)" : "rgba(255,255,255,0.04)",
          border: open ? "1px solid rgba(34,211,238,0.3)" : "1px solid rgba(255,255,255,0.1)",
          borderRadius: "8px",
          color: "#f1f5f9",
          fontSize: "14px",
          fontFamily: "DM Sans, sans-serif",
          cursor: "pointer",
          textAlign: "left",
          outline: "none",
          transition: "all 0.2s ease",
        }}
      >
        <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {value}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          style={{ display: "flex", color: open ? "#22d3ee" : "#475569", flexShrink: 0 }}
        >
          <RiArrowDownSLine size={16} />
        </motion.span>
      </button>

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
              zIndex: 400,
              background: "#111827",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "10px",
              boxShadow: "0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(34,211,238,0.06)",
              overflow: "hidden",
              transformOrigin: "top",
            }}
          >
            <div style={{ maxHeight: "180px", overflowY: "auto", padding: "6px" }}>
              {categories.map((cat) => {
                const active = cat === value;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => { onChange(cat); setOpen(false); }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "8px",
                      padding: "8px 10px",
                      borderRadius: "7px",
                      border: "none",
                      background: active ? "rgba(34,211,238,0.1)" : "transparent",
                      color: active ? "#22d3ee" : "#94a3b8",
                      fontSize: "13px",
                      fontFamily: "DM Sans, sans-serif",
                      cursor: "pointer",
                      textAlign: "left",
                      fontWeight: active ? 500 : 400,
                      transition: "all 0.12s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                        (e.currentTarget as HTMLElement).style.color = "#f1f5f9";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        (e.currentTarget as HTMLElement).style.background = "transparent";
                        (e.currentTarget as HTMLElement).style.color = "#94a3b8";
                      }
                    }}
                  >
                    <span>{cat}</span>
                    {active && <RiCheckLine size={13} style={{ flexShrink: 0 }} />}
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

// Main Modal 
export default function AddTransactionModal({ open, onClose, editingTransaction }: Props) {
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

  const handleTypeChange = (t: TransactionType) => {
    setForm((f) => ({
      ...f,
      type: t,
      category: t === "income" ? "Salary" : "Food & Dining",
    }));
  };

  const categories = form.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = () => {
    if (!form.date || !form.amount || !form.description || !form.merchant) {
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

  const inputStyle: React.CSSProperties = {
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
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "11px",
    fontFamily: "DM Mono, monospace",
    color: "#475569",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
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
              WebkitBackdropFilter: "blur(4px)",
              zIndex: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />

          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 101,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
              pointerEvents: "none", 
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 20 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                pointerEvents: "auto",
                width: "100%",
                maxWidth: "480px",
                background: "linear-gradient(135deg, #111827 0%, #0f172a 100%)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "20px",
                padding: "28px",
                boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(34,211,238,0.04)",
              }}
            >
              {/* Header  */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                <div>
                  <h2
                    style={{
                      fontFamily: "Syne, sans-serif",
                      fontSize: "18px",
                      fontWeight: 700,
                      color: "#f1f5f9",
                      letterSpacing: "-0.02em",
                      marginBottom: "3px",
                    }}
                  >
                    {editingTransaction ? "Edit Transaction" : "New Transaction"}
                  </h2>
                  <p style={{ fontSize: "12px", color: "#475569", fontFamily: "DM Sans, sans-serif" }}>
                    {editingTransaction ? "Update the details below" : "Fill in the transaction details"}
                  </p>
                </div>

                <button
                  onClick={onClose}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "8px",
                    padding: "7px",
                    color: "#64748b",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(248,113,113,0.1)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(248,113,113,0.25)";
                    (e.currentTarget as HTMLElement).style.color = "#f87171";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                    (e.currentTarget as HTMLElement).style.color = "#64748b";
                  }}
                >
                  <RiCloseLine size={18} />
                </button>
              </div>

              {/* Type toggle */}
              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle}>Transaction Type</label>
                <div
                  style={{
                    display: "flex",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "10px",
                    padding: "4px",
                    gap: "4px",
                  }}
                >
                  {(["income", "expense"] as TransactionType[]).map((t) => {
                    const active = form.type === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => handleTypeChange(t)}
                        style={{
                          flex: 1,
                          padding: "9px",
                          borderRadius: "8px",
                          cursor: "pointer",
                          background: active
                            ? t === "income" ? "rgba(52,211,153,0.14)" : "rgba(248,113,113,0.14)"
                            : "transparent",
                          color: active
                            ? t === "income" ? "#34d399" : "#f87171"
                            : "#475569",
                          border: active
                            ? t === "income" ? "1px solid rgba(52,211,153,0.2)" : "1px solid rgba(248,113,113,0.2)"
                            : "1px solid transparent",
                          fontSize: "13px",
                          fontWeight: active ? 600 : 400,
                          fontFamily: "DM Mono, monospace",
                          letterSpacing: "0.06em",
                          textTransform: "capitalize",
                          transition: "all 0.2s ease",
                        } as React.CSSProperties}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Amount + Date */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                <div>
                  <label style={labelStyle}>Amount (USD) *</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={form.amount}
                    min="0"
                    step="0.01"
                    onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Date *</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    style={{ ...inputStyle, colorScheme: "dark" }}
                  />
                </div>
              </div>

              {/*  Category */}
              <div style={{ marginBottom: "14px" }}>
                <label style={labelStyle}>Category *</label>
                <CategorySelect
                  value={form.category}
                  onChange={(cat) => setForm((f) => ({ ...f, category: cat }))}
                  categories={categories}
                />
              </div>

              {/* Merchant  */}
              <div style={{ marginBottom: "14px" }}>
                <label style={labelStyle}>Merchant / Source *</label>
                <input
                  type="text"
                  placeholder="e.g. Amazon, TechCorp Inc."
                  value={form.merchant}
                  onChange={(e) => setForm((f) => ({ ...f, merchant: e.target.value }))}
                  style={inputStyle}
                />
              </div>

              {/*  Description  */}
              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle}>Description *</label>
                <input
                  type="text"
                  placeholder="Brief description of this transaction"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  style={inputStyle}
                />
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    style={{
                      fontSize: "12px",
                      color: "#f87171",
                      fontFamily: "DM Mono, monospace",
                      marginBottom: "16px",
                      padding: "9px 12px",
                      background: "rgba(248,113,113,0.08)",
                      borderRadius: "8px",
                      border: "1px solid rgba(248,113,113,0.2)",
                    }}
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Actions */}
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={onClose}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "10px",
                    color: "#64748b",
                    fontSize: "14px",
                    fontFamily: "DM Sans, sans-serif",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)";
                    (e.currentTarget as HTMLElement).style.color = "#94a3b8";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                    (e.currentTarget as HTMLElement).style.color = "#64748b";
                  }}
                >
                  Cancel
                </button>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  style={{
                    flex: 2,
                    padding: "12px",
                    background: "linear-gradient(135deg, #22d3ee, #0891b2)",
                    border: "none",
                    borderRadius: "10px",
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: 600,
                    fontFamily: "DM Sans, sans-serif",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    boxShadow: "0 4px 20px rgba(34,211,238,0.25)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  <RiCheckLine size={16} />
                  {editingTransaction ? "Save Changes" : "Add Transaction"}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}