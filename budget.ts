export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  timestamp: number;
}

export interface BudgetCategory {
  id: string;
  name: string;
  limit: number;
  spent: number;
  color: string;
  icon: string;
}

export interface BudgetGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
}

export interface NotificationSettings {
  budgetWarning: number; // percentage threshold
  lowBalance: number; // absolute amount
  irregularExpense: number; // percentage above average
  enabled: boolean;
}

export interface BudgetData {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  monthlyBudget: number;
  weeklyBudget: number;
  dailyBudget: number;
  categories: BudgetCategory[];
  goals: BudgetGoal[];
  notifications: NotificationSettings;
}