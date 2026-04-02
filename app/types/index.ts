export type Role = "admin" | "viewer";

export type TransactionType = "income" | "expense";

export type Category =
  | "Salary"
  | "Freelance"
  | "Investment"
  | "Food & Dining"
  | "Transport"
  | "Shopping"
  | "Healthcare"
  | "Entertainment"
  | "Utilities"
  | "Rent"
  | "Education"
  | "Other";

export interface Transaction {
  id: string;
  date: string; // ISO string
  amount: number;
  category: Category;
  type: TransactionType;
  description: string;
  merchant: string;
}

export interface MonthlySummary {
  month: string; // e.g. "Jan"
  income: number;
  expenses: number;
  balance: number;
}

export interface CategoryBreakdown {
  category: Category;
  amount: number;
  percentage: number;
  color: string;
}

export type SortField = "date" | "amount" | "category" | "merchant";
export type SortDirection = "asc" | "desc";

export interface FilterState {
  search: string;
  type: TransactionType | "all";
  category: Category | "all";
  sortField: SortField;
  sortDirection: SortDirection;
  dateFrom: string;
  dateTo: string;
}