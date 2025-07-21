import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, DollarSign, Target, Save } from 'lucide-react';
import { NotificationSettings } from '../types/budget';
import { formatCurrency } from '../utils/currency';

interface SettingsProps {
  monthlyBudget: number;
  weeklyBudget: number;
  notifications: NotificationSettings;
  onUpdateMonthlyBudget: (amount: number) => void;
  onUpdateWeeklyBudget: (amount: number) => void;
  onUpdateNotifications: (settings: NotificationSettings) => void;
}

export const Settings: React.FC<SettingsProps> = ({
  monthlyBudget,
  weeklyBudget,
  notifications,
  onUpdateMonthlyBudget,
  onUpdateWeeklyBudget,
  onUpdateNotifications,
}) => {
  const [formData, setFormData] = useState({
    monthlyBudget: monthlyBudget.toString(),
    weeklyBudget: weeklyBudget.toString(),
    notifications: { ...notifications },
  });

  const handleSave = () => {
    onUpdateMonthlyBudget(parseFloat(formData.monthlyBudget));
    onUpdateWeeklyBudget(parseFloat(formData.weeklyBudget));
    onUpdateNotifications(formData.notifications);
    
    // Show success message
    alert('⚙️ Settings saved successfully!');
  };

  const handleNotificationChange = (key: keyof NotificationSettings, value: number | boolean) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <SettingsIcon className="h-5 w-5 mr-2" />
          Settings
        </h2>

        {/* Budget Settings */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Budget Limits
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Budget (₹)
                </label>
                <input
                  type="number"
                  value={formData.monthlyBudget}
                  onChange={(e) => setFormData(prev => ({ ...prev, monthlyBudget: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weekly Budget (₹)
                </label>
                <input
                  type="number"
                  value={formData.weeklyBudget}
                  onChange={(e) => setFormData(prev => ({ ...prev, weeklyBudget: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notification Settings
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Enable Notifications</h4>
                  <p className="text-sm text-gray-500">Receive alerts for budget and spending</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.notifications.enabled}
                    onChange={(e) => handleNotificationChange('enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Warning Threshold ({formData.notifications.budgetWarning}%)
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={formData.notifications.budgetWarning}
                    onChange={(e) => handleNotificationChange('budgetWarning', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Low Balance Alert (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.notifications.lowBalance}
                    onChange={(e) => handleNotificationChange('lowBalance', parseFloat(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Irregular Expense Threshold ({formData.notifications.irregularExpense}% above average)
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="300"
                    value={formData.notifications.irregularExpense}
                    onChange={(e) => handleNotificationChange('irregularExpense', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>100%</span>
                    <span>300%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};