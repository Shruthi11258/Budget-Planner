import React, { useState } from 'react';
import { BarChart3, Home, History, Settings, TrendingUp, PiggyBank, Target, LogOut, User } from 'lucide-react';
import { AuthWrapper } from './components/Auth/AuthWrapper';
import { Dashboard } from './components/Dashboard';
import { AddTransaction } from './components/AddTransaction';
import { TransactionHistory } from './components/TransactionHistory';
import { Analytics } from './components/Analytics';
import { Settings as SettingsComponent } from './components/Settings';
import { CategoryManager } from './components/CategoryManager';
import { BudgetLimitsManager } from './components/BudgetLimitsManager';
import { useBudget } from './hooks/useBudget';
import { useAuth } from './hooks/useAuth';
import { formatCurrency } from './utils/currency';

type ActiveTab = 'dashboard' | 'history' | 'analytics' | 'categories' | 'budgets' | 'settings';

function App() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const {
    transactions,
    budgetData,
    currentSpending,
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
  } = useBudget();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'history', label: 'History', icon: History },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'categories', label: 'Categories', icon: Target },
    { id: 'budgets', label: 'Budget Limits', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            budgetData={budgetData}
            activeNotifications={activeNotifications}
            onClearNotification={clearNotification}
          />
        );
      case 'history':
        return (
          <TransactionHistory
            transactions={transactions}
            onDeleteTransaction={deleteTransaction}
          />
        );
      case 'analytics':
        return (
          <Analytics
            transactions={transactions}
            categories={budgetData.categories}
          />
        );
      case 'categories':
        return (
          <CategoryManager
            categories={budgetData.categories}
            onUpdateCategory={updateCategory}
            onAddCategory={addCategory}
            onDeleteCategory={deleteCategory}
          />
        );
      case 'budgets':
        return (
          <BudgetLimitsManager
            monthlyBudget={budgetData.monthlyBudget}
            weeklyBudget={budgetData.weeklyBudget}
            dailyBudget={budgetData.dailyBudget}
            onUpdateMonthlyBudget={setMonthlyBudget}
            onUpdateWeeklyBudget={setWeeklyBudget}
            onUpdateDailyBudget={setDailyBudget}
            currentSpending={currentSpending}
          />
        );
      case 'settings':
        return (
          <SettingsComponent
            monthlyBudget={budgetData.monthlyBudget}
            weeklyBudget={budgetData.weeklyBudget}
            notifications={budgetData.notifications}
            onUpdateMonthlyBudget={setMonthlyBudget}
            onUpdateWeeklyBudget={setWeeklyBudget}
            onUpdateNotifications={setNotifications}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center">
                  <PiggyBank className="h-8 w-8 text-blue-600" />
                  <h1 className="ml-3 text-xl font-bold text-gray-900">Budget Planner</h1>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  Balance: <span className={`font-semibold ${
                    budgetData.balance >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(budgetData.balance)}
                  </span>
                </div>
                
                {/* User Info */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>Welcome, {user?.fullName}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-1 text-sm text-gray-500 hover:text-red-600 transition-colors duration-200"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
                
                {activeNotifications.length > 0 && (
                  <div className="relative">
                    <div className="h-2 w-2 bg-red-500 rounded-full absolute -top-1 -right-1"></div>
                    <TrendingUp className="h-5 w-5 text-red-500" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as ActiveTab)}
                    className={`flex items-center px-3 py-4 text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderContent()}
        </main>

        {/* Add Transaction Button */}
        <AddTransaction
          onAddTransaction={addTransaction}
          categories={budgetData.categories.map(cat => cat.name)}
        />
      </div>
    </AuthWrapper>
  );
}

export default App;