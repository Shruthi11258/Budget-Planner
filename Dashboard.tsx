import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target, AlertTriangle, CheckCircle, Receipt, Calendar, CreditCard } from 'lucide-react';
import { BudgetData } from '../types/budget';
import { formatCurrency } from '../utils/currency';

interface DashboardProps {
  budgetData: BudgetData;
  activeNotifications: string[];
  onClearNotification: (notification: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  budgetData,
  activeNotifications,
  onClearNotification,
}) => {
  const { totalIncome, totalExpenses, balance, monthlyBudget, categories } = budgetData;
  const budgetUsed = (totalExpenses / monthlyBudget) * 100;
  const budgetRemaining = monthlyBudget - totalExpenses;

  // Get recent transactions for quick overview
  const recentExpenses = budgetData.categories
    .filter(cat => cat.spent > 0)
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 3);

  const getBalanceColor = (balance: number) => {
    if (balance > 25000) return 'text-green-600';
    if (balance > 0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBudgetStatusColor = (percentage: number) => {
    if (percentage < 70) return 'bg-green-500';
    if (percentage < 90) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {activeNotifications.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-red-800 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Active Alerts
            </h3>
          </div>
          <div className="space-y-2">
            {activeNotifications.map((notification, index) => (
              <div key={index} className="flex items-center justify-between bg-white p-3 rounded-md">
                <span className="text-red-700">{notification}</span>
                <button
                  onClick={() => onClearNotification(notification)}
                  className="text-red-500 hover:text-red-700"
                >
                  <CheckCircle className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-100">Total Income</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(totalIncome)}</p>
            </div>
            <div className="h-12 w-12 bg-green-400 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-md p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-100">Total Expenses</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(totalExpenses)}</p>
            </div>
            <div className="h-12 w-12 bg-red-400 rounded-full flex items-center justify-center">
              <TrendingDown className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className={`rounded-lg shadow-md p-6 text-white ${
          balance >= 0 
            ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
            : 'bg-gradient-to-r from-orange-500 to-red-500'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-100">Current Balance</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(balance)}
              </p>
              <p className="text-xs text-blue-100 mt-1">
                {balance >= 0 ? 'You\'re in good shape!' : 'Spending more than earning'}
              </p>
            </div>
            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
              balance >= 0 ? 'bg-blue-400' : 'bg-orange-400'
            }`}>
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-100">Budget Remaining</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(budgetRemaining)}
              </p>
              <p className="text-xs text-purple-100 mt-1">
                This month's budget
              </p>
            </div>
            <div className="h-12 w-12 bg-purple-400 rounded-full flex items-center justify-center">
              <Target className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Spending Overview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Receipt className="h-5 w-5 mr-2" />
          Your Recent Spending
        </h3>
        
        {recentExpenses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentExpenses.map((category) => (
              <div key={category.id} className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border-l-4" style={{ borderLeftColor: category.color }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{category.name}</span>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                </div>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(category.spent)}</p>
                <p className="text-xs text-gray-500">
                  {((category.spent / category.limit) * 100).toFixed(1)}% of {formatCurrency(category.limit)} limit
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No expenses recorded yet</p>
            <p className="text-sm text-gray-400">Start tracking your spending by adding transactions</p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Financial Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Income</span>
              <span className="font-bold text-green-600">{formatCurrency(totalIncome)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Spent</span>
              <span className="font-bold text-red-600">{formatCurrency(totalExpenses)}</span>
            </div>
            <div className="flex justify-between items-center border-t pt-2">
              <span className="text-gray-600 font-medium">Net Balance</span>
              <span className={`font-bold text-lg ${getBalanceColor(balance)}`}>
                {formatCurrency(balance)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Budget Remaining</span>
              <span className={`font-bold ${getBalanceColor(budgetRemaining)}`}>
                {formatCurrency(budgetRemaining)}
              </span>
            </div>
            <div className="flex justify-between items-center border-t pt-2">
              <span className="text-gray-600">Budget Used</span>
              <span className="font-bold text-blue-600">{budgetUsed.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Spending Insights
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Categories Used</span>
              <span className="font-bold text-blue-600">
                {categories.filter(cat => cat.spent > 0).length} of {categories.length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Highest Spending</span>
              <span className="font-bold text-purple-600">
                {recentExpenses[0]?.name || 'None'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average per Category</span>
              <span className="font-bold text-green-600">
                {formatCurrency(totalExpenses / Math.max(categories.filter(cat => cat.spent > 0).length, 1))}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Progress */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Budget Progress</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">
              {formatCurrency(totalExpenses)} of {formatCurrency(monthlyBudget)} spent
            </span>
            <span className="text-sm font-medium text-gray-700">
              {budgetUsed.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${getBudgetStatusColor(budgetUsed)}`}
              style={{ width: `${Math.min(budgetUsed, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
        <div className="space-y-4">
          {categories.map((category) => {
            const percentage = category.limit > 0 ? (category.spent / category.limit) * 100 : 0;
            return (
              <div key={category.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{category.name}</span>
                  <span className="text-sm text-gray-500">
                    {formatCurrency(category.spent)} / {formatCurrency(category.limit)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(percentage, 100)}%`,
                      backgroundColor: category.color,
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};