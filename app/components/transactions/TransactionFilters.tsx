"use client";

import { motion } from "framer-motion";
import { RiSearchLine, RiSortAsc, RiSortDesc, RiCloseLine } from "react-icons/ri";
import { useApp } from "@/app/context/AppContext";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/app/mock-data/mockData";
import { Category, SortField } from "@/app/types";
import CustomSelect from "@/app/components/select-ui/CustomSelect";

const allCategories = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

const typeOptions = [
  { value: "all", label: "All Types" },
  { value: "income", label: "Income" },
  { value: "expense", label: "Expense" },
];

const categoryOptions = [
  { value: "all", label: "All Categories" },
  ...allCategories.map((c) => ({ value: c, label: c })),
];

const sortFieldOptions = [
  { value: "date", label: "Date" },
  { value: "amount", label: "Amount" },
  { value: "category", label: "Category" },
  { value: "merchant", label: "Merchant" },
];

export default function TransactionFilters() {
  const { filters, setFilters, resetFilters } = useApp();

  const hasActiveFilters =
    filters.search ||
    filters.type !== "all" ||
    filters.category !== "all" ||
    filters.dateFrom ||
    filters.dateTo;

  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "8px",
    color: "#f1f5f9",
    fontSize: "13px",
    fontFamily: "DM Sans, sans-serif",
    padding: "8px 12px",
    outline: "none",
    width: "100%",
    transition: "border-color 0.2s ease",
  } as React.CSSProperties;

  const labelStyle = {
    display: "block",
    fontSize: "10px",
    fontFamily: "DM Mono, monospace",
    color: "#475569",
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    marginBottom: "6px",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #0d1421 100%)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "16px",
        padding: "20px",
        display: "flex",
        flexWrap: "wrap",
        gap: "12px",
        alignItems: "flex-end",
      }}
    >
      {/* Search */}
      <div style={{ flex: "2 1 200px", minWidth: "180px" }}>
        <label style={labelStyle}>Search</label>
        <div style={{ position: "relative" }}>
          <RiSearchLine
            size={14}
            color="#475569"
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
          <input
            type="text"
            placeholder="Description, merchant, category..."
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            style={{ ...inputStyle, paddingLeft: "32px" }}
          />
        </div>
      </div>

      {/* Type */}
      <div style={{ flex: "1 1 130px", minWidth: "120px" }}>
        <label style={labelStyle}>Type</label>
        <CustomSelect
          value={filters.type}
          onChange={(val) => setFilters({ type: val as any })}
          options={typeOptions}
        />
      </div>

      {/* Category */}
      <div style={{ flex: "1 1 160px", minWidth: "150px" }}>
        <label style={labelStyle}>Category</label>
        <CustomSelect
          value={filters.category}
          onChange={(val) => setFilters({ category: val as Category | "all" })}
          options={categoryOptions}
        />
      </div>

      {/* Sort By */}
      <div style={{ flex: "1 1 130px", minWidth: "120px" }}>
        <label style={labelStyle}>Sort By</label>
        <CustomSelect
          value={filters.sortField}
          onChange={(val) => setFilters({ sortField: val as SortField })}
          options={sortFieldOptions}
        />
      </div>

      {/* Sort Direction toggle */}
      <div>
        <label style={labelStyle}>Order</label>
        <button
          onClick={() =>
            setFilters({
              sortDirection: filters.sortDirection === "asc" ? "desc" : "asc",
            })
          }
          style={{
            ...inputStyle,
            width: "auto",
            padding: "8px 12px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: "#94a3b8",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {filters.sortDirection === "asc" ? (
            <RiSortAsc size={16} color="#22d3ee" />
          ) : (
            <RiSortDesc size={16} color="#22d3ee" />
          )}
          <span
            style={{
              fontFamily: "DM Mono, monospace",
              fontSize: "12px",
              letterSpacing: "0.05em",
              color: "#22d3ee",
            }}
          >
            {filters.sortDirection === "asc" ? "ASC" : "DESC"}
          </span>
        </button>
      </div>

      {/* Date From */}
      <div style={{ flex: "1 1 130px", minWidth: "120px" }}>
        <label style={labelStyle}>From</label>
        <input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => setFilters({ dateFrom: e.target.value })}
          style={{ ...inputStyle, colorScheme: "dark" }}
        />
      </div>

      {/* Date To */}
      <div style={{ flex: "1 1 130px", minWidth: "120px" }}>
        <label style={labelStyle}>To</label>
        <input
          type="date"
          value={filters.dateTo}
          onChange={(e) => setFilters({ dateTo: e.target.value })}
          style={{ ...inputStyle, colorScheme: "dark" }}
        />
      </div>

      {/* Reset */}
      {hasActiveFilters && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={resetFilters}
          style={{
            padding: "8px 14px",
            background: "rgba(248,113,113,0.1)",
            border: "1px solid rgba(248,113,113,0.2)",
            borderRadius: "8px",
            color: "#f87171",
            fontSize: "12px",
            fontFamily: "DM Mono, monospace",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            whiteSpace: "nowrap",
            alignSelf: "flex-end",
          }}
        >
          <RiCloseLine size={14} />
          Reset
        </motion.button>
      )}
    </motion.div>
  );
}
