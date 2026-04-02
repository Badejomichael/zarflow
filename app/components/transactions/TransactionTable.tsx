"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiPencilLine,
  RiDeleteBinLine,
  RiAddLine,
  RiArrowUpLine,
  RiArrowDownLine,
  RiFileDownloadLine,
} from "react-icons/ri";
import { useApp } from "@/app/context/AppContext";
import { Transaction } from "@/app/types";
import { CATEGORY_COLORS } from "@/app/mock-data/mockData";
import AddTransactionModal from "./AddTransactionModal";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatAmount(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(n);
}

export default function TransactionTable() {
  const { filteredTransactions, deleteTransaction, role } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 12;

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / perPage));
  const paginated = filteredTransactions.slice((page - 1) * perPage, page * perPage);

  const handleEdit = (t: Transaction) => {
    setEditing(t);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const exportCSV = () => {
    const headers = ["Date", "Merchant", "Description", "Category", "Type", "Amount"];
    const rows = filteredTransactions.map((t) => [
      t.date,
      t.merchant,
      t.description,
      t.category,
      t.type,
      t.amount,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <AnimatePresence>
                {paginated.map((t, i) => (
                  <motion.tr key={t.id}>
                    
                    {/* Category */}
                    <td>
                      <span
                        style={{
                          background: `${
                            CATEGORY_COLORS[t.category] || "#64748b"
                          }15`,
                          border: `1px solid ${
                            CATEGORY_COLORS[t.category] || "#64748b"
                          }25`,
                          color: CATEGORY_COLORS[t.category] || "#64748b",
                          padding: "4px 10px",
                          borderRadius: "20px",
                          fontSize: "11px",
                        }}
                      >
                        {t.category}
                      </span>
                    </td>

                    {/* Type */}
                    <td>
                      <span
                        style={{
                          border: `1px solid ${
                            t.type === "income"
                              ? "rgba(52,211,153,0.2)"
                              : "rgba(248,113,113,0.2)"
                          }`,
                          color: t.type === "income" ? "#34d399" : "#f87171",
                          padding: "4px 8px",
                          borderRadius: "20px",
                          fontSize: "11px",
                        }}
                      >
                        {t.type === "income" ? (
                          <RiArrowUpLine size={10} />
                        ) : (
                          <RiArrowDownLine size={10} />
                        )}
                        {t.type}
                      </span>
                    </td>

                    {/* Amount */}
                    <td>
                      <span>
                        {t.type === "expense" ? "-" : "+"}
                        {formatAmount(t.amount)}
                      </span>
                    </td>

                    {/* Actions */}
                    {role === "admin" && (
                      <td>
                        <button onClick={() => handleEdit(t)}>
                          <RiPencilLine />
                        </button>
                        <button onClick={() => deleteTransaction(t.id)}>
                          <RiDeleteBinLine />
                        </button>
                      </td>
                    )}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      <AddTransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editingTransaction={editing}
      />
    </>
  );
}