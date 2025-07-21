import { useState, useEffect, useCallback } from 'react';
import { Transaction, BudgetData, BudgetCategory, NotificationSettings } from '../types/budget';
import { useAuth } from './useAuth';

const DEFAULT_CATEGORIES: BudgetCategory[] = [
  { id: '1', name: 'Food & Dining', limit: 15000, spent: 0, color: '#EF4444', icon: 'UtensilsCrossed' },
  { id: '2', name: 'Transportation', limit: 8000, spent: 0, color: '#3B82F6', icon: 'Car' },
  { id: '3', name: 'Entertainment', limit: 5000, spent: 0, color: '#8B5CF6', icon: 'Film' },
  { id: '4', name: 'Shopping', limit: 12000, spent: 0, color: '#F59E0B', icon: 'ShoppingBag' },
  { id: '5', name: 'Bills & Utilities', limit: 20000, spent: 0, color: '#10B981', icon: 'Receipt' },
  { id: '6', name: 'Healthcare', limit: 8000, spent: 0, color: '#EC4899', icon: 'Heart' },
  { id: '7', name: 'Education', limit: 6000, spent: 0, color: '#6366F1', icon: 'GraduationCap' },
  { id: '8', name: 'Other', limit: 5000, spent: 0, color: '#6B7280', icon: 'MoreHorizontal' },
];

const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  budgetWarning: 80,
  lowBalance: 2500,
  irregularExpense: 150,
  enabled: true,
};

export const useBudget = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<BudgetCategory[]>(DEFAULT_CATEGORIES);
  const [monthlyBudget, setMonthlyBudget] = useState(80000);
  const [weeklyBudget, setWeeklyBudget] = useState(20000);
  const [dailyBudget, setDailyBudget] = useState(2500);
  const [notifications, setNotifications] = useState<NotificationSettings>(DEFAULT_NOTIFICATIONS);
  const [activeNotifications, setActiveNotifications] = useState<string[]>([]);

  // Create user-specific storage keys
  const getStorageKey = (key: string) => {
    return user ? `${key}-${user.id}` : key;
  };

  // Load data from localStorage on mount
  useEffect(() => {
    if (!user) return;

    const savedTransactions = localStorage.getItem(getStorageKey('budget-transactions'));
    const savedCategories = localStorage.getItem(getStorageKey('budget-categories'));
    const savedMonthlyBudget = localStorage.getItem(getStorageKey('budget-monthly'));
    const savedWeeklyBudget = localStorage.getItem(getStorageKey('budget-weekly'));
    const savedDailyBudget = localStorage.getItem(getStorageKey('budget-daily'));
    const savedNotifications = localStorage.getItem(getStorageKey('budget-notifications'));

    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
    if (savedMonthlyBudget) {
      setMonthlyBudget(Number(savedMonthlyBudget));
    }
    if (savedWeeklyBudget) {
      setWeeklyBudget(Number(savedWeeklyBudget));
    }
    if (savedDailyBudget) {
      setDailyBudget(Number(savedDailyBudget));
    }
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
  }, [user]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(getStorageKey('budget-transactions'), JSON.stringify(transactions));
    }
  }, [transactions, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(getStorageKey('budget-categories'), JSON.stringify(categories));
    }
  }, [categories, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(getStorageKey('budget-monthly'), monthlyBudget.toString());
    }
  }, [monthlyBudget, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(getStorageKey('budget-weekly'), weeklyBudget.toString());
    }
  }, [weeklyBudget, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(getStorageKey('budget-daily'), dailyBudget.toString());
    }
  }, [dailyBudget, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(getStorageKey('budget-notifications'), JSON.stringify(notifications));
    }
  }, [notifications, user]);

  // Debug: Log when data is saved
  useEffect(() => {
    if (user) {
      console.log(`💾 Data saved for user ${user.username}:`, {
      transactions: transactions.length,
      categories: categories.length,
      monthlyBudget,
      weeklyBudget,
      dailyBudget
      });
    }
  }, [transactions, categories, monthlyBudget, weeklyBudget, dailyBudget, user]);

  // Calculate current spending periods
  const getCurrentSpending = useCallback(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const monthlySpent = transactions
      .filter(t => t.type === 'expense' && new Date(t.date) >= startOfMonth)
      .reduce((sum, t) => sum + t.amount, 0);

    const weeklySpent = transactions
      .filter(t => t.type === 'expense' && new Date(t.date) >= startOfWeek)
      .reduce((sum, t) => sum + t.amount, 0);

    const dailySpent = transactions
      .filter(t => t.type === 'expense' && new Date(t.date) >= startOfDay)
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      monthly: monthlySpent,
      weekly: weeklySpent,
      daily: dailySpent,
    };
  }, [transactions]);

  // Calculate budget data
  const budgetData = useCallback((): BudgetData => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    // Update category spending
    const updatedCategories = categories.map(category => {
      const spent = transactions
        .filter(t => t.type === 'expense' && t.category === category.name)
        .reduce((sum, t) => sum + t.amount, 0);
      return { ...category, spent };
    });

    return {
      totalIncome,
      totalExpenses,
      balance,
      monthlyBudget,
      weeklyBudget,
      dailyBudget,
      categories: updatedCategories,
      goals: [],
      notifications,
    };
  }, [transactions, categories, monthlyBudget, weeklyBudget, dailyBudget, notifications]);

  // Check for notifications
  useEffect(() => {
    if (!notifications.enabled) return;

    const data = budgetData();
    const currentSpending = getCurrentSpending();
    const newNotifications: string[] = [];

    // Check budget warnings
    data.categories.forEach(category => {
      const percentage = (category.spent / category.limit) * 100;
      if (percentage >= notifications.budgetWarning) {
        newNotifications.push(`${category.name} budget ${percentage >= 100 ? 'exceeded' : 'warning'}`);
      }
    });

    // Check period budget warnings
    if ((currentSpending.monthly / monthlyBudget) * 100 >= notifications.budgetWarning) {
      newNotifications.push('Monthly budget warning');
    }
    if ((currentSpending.weekly / weeklyBudget) * 100 >= notifications.budgetWarning) {
      newNotifications.push('Weekly budget warning');
    }
    if ((currentSpending.daily / dailyBudget) * 100 >= notifications.budgetWarning) {
      newNotifications.push('Daily budget warning');
    }

    // Check low balance
    if (data.balance <= notifications.lowBalance) {
      newNotifications.push('Low balance alert');
    }

    setActiveNotifications(newNotifications);
  }, [transactions, budgetData, getCurrentSpending, notifications, monthlyBudget, weeklyBudget, dailyBudget]);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'timestamp'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateCategory = (categoryId: string, updates: Partial<BudgetCategory>) => {
    setCategories(prev =>
      prev.map(cat => cat.id === categoryId ? { ...cat, ...updates } : cat)
    );
  };

  const addCategory = (category: Omit<BudgetCategory, 'id' | 'spent'>) => {
    const newCategory: BudgetCategory = {
      ...category,
      id: Date.now().toString(),
      spent: 0,
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const deleteCategory = (categoryId: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
  };

  const clearNotification = (notification: string) => {
    setActiveNotifications(prev => prev.filter(n => n !== notification));
  };

  return {
    transactions,
    budgetData: budgetData(),
    currentSpending: getCurrentSpending(),
    activeNotifications,
    addTransaction,
    deleteTransaction,
    updateCategory,
    addCategory,
    deleteCategory,
    setMonthlyBudget,
    setWeeklyBudget,
    setDailyBudget,
    setNotifications,
    clearNotification,
  };
};