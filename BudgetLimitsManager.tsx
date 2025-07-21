import React, { useState } from 'react';
import { Target, Calendar, Save, TrendingUp, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../utils/currency';

interface BudgetLimitsManagerProps {
  monthlyBudget: number;
  weeklyBudget: number;
  dailyBudget: number;
  onUpdateMonthlyBudget: (amount: number) => void;
  onUpdateWeeklyBudget: (amount: number) => void;
  onUpdateDailyBudget: (amount: number) => void;
  currentSpending: {
    monthly: number;
    weekly: number;
    daily: number;
  };
}

export const BudgetLimitsManager: React.FC<BudgetLimitsManagerProps> = ({
  monthlyBudget,
  weeklyBudget,
  dailyBudget,
  onUpdateMonthlyBudget,
  onUpdateWeeklyBudget,
  onUpdateDailyBudget,
  currentSpending,
}) => {
  const [formData, setFormData] = useState({
    monthly: monthlyBudget.toString(),
    weekly: weeklyBudget.toString(),
    daily: dailyBudget.toString(),
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSave = () => {
    onUpdateMonthlyBudget(parseFloat(formData.monthly) || 0);
    onUpdateWeeklyBudget(parseFloat(formData.weekly) || 0);
    onUpdateDailyBudget(parseFloat(formData.daily) || 0);
    
    // Show success message
    alert('🎯 Budget limits saved successfully!');
  };

  const getProgressColor = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusIcon = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return <AlertCircle className="h-5 w-5 text-red-500" />;
    if (percentage >= 80) return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    return <TrendingUp className="h-5 w-5 text-green-500" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Target className="h-5 w-5 mr-2" />
          Budget Limits
        </h3>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          {showAdvanced ? 'Simple View' : 'Advanced Settings'}
        </button>
      </div>

      {/* Current Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">Monthly</span>
            {getStatusIcon(currentSpending.monthly, monthlyBudget)}
          </div>
          <p className="text-lg font-bold text-blue-900">
            {formatCurrency(currentSpending.monthly)} / {formatCurrency(monthlyBudget)}
          </p>
          <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(currentSpending.monthly, monthlyBudget)}`}
              style={{ width: `${Math.min((currentSpending.monthly / monthlyBudget) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-900">Weekly</span>
            {getStatusIcon(currentSpending.weekly, weeklyBudget)}
          </div>
          <p className="text-lg font-bold text-green-900">
            {formatCurrency(currentSpending.weekly)} / {formatCurrency(weeklyBudget)}
          </p>
          <div className="w-full bg-green-200 rounded-full h-2 mt-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(currentSpending.weekly, weeklyBudget)}`}
              style={{ width: `${Math.min((currentSpending.weekly / weeklyBudget) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-purple-900">Daily</span>
            {getStatusIcon(currentSpending.daily, dailyBudget)}
          </div>
          <p className="text-lg font-bold text-purple-900">
            {formatCurrency(currentSpending.daily)} / {formatCurrency(dailyBudget)}
          </p>
          <div className="w-full bg-purple-200 rounded-full h-2 mt-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(currentSpending.daily, dailyBudget)}`}
              style={{ width: `${Math.min((currentSpending.daily / dailyBudget) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Budget Settings */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="h-4 w-4 inline mr-1" />
              Monthly Budget (₹)
            </label>
            <input
              type="number"
              value={formData.monthly}
              onChange={(e) => setFormData(prev => ({ ...prev, monthly: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
              step="1000"
              placeholder="80000"
            />
            <p className="text-xs text-gray-500 mt-1">
              Recommended: ₹50,000 - ₹1,50,000
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="h-4 w-4 inline mr-1" />
              Weekly Budget (₹)
            </label>
            <input
              type="number"
              value={formData.weekly}
              onChange={(e) => setFormData(prev => ({ ...prev, weekly: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
              step="500"
              placeholder="20000"
            />
            <p className="text-xs text-gray-500 mt-1">
              Auto-calculated: ₹{Math.round(parseFloat(formData.monthly) / 4.33) || 0}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="h-4 w-4 inline mr-1" />
              Daily Budget (₹)
            </label>
            <input
              type="number"
              value={formData.daily}
              onChange={(e) => setFormData(prev => ({ ...prev, daily: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
              step="100"
              placeholder="2500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Auto-calculated: ₹{Math.round(parseFloat(formData.monthly) / 30) || 0}
            </p>
          </div>
        </div>

        {showAdvanced && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Advanced Budget Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Auto-adjust Weekly Budget
                </label>
                <button
                  onClick={() => setFormData(prev => ({ 
                    ...prev, 
                    weekly: Math.round(parseFloat(prev.monthly) / 4.33).toString() 
                  }))}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors duration-200"
                >
                  Set to Monthly ÷ 4.33
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Auto-adjust Daily Budget
                </label>
                <button
                  onClick={() => setFormData(prev => ({ 
                    ...prev, 
                    daily: Math.round(parseFloat(prev.monthly) / 30).toString() 
                  }))}
                  className="px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors duration-200"
                >
                  Set to Monthly ÷ 30
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <button
            onClick={handleSave}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Budget Limits
          </button>
        </div>
      </div>
    </div>
  );
};