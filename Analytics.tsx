import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import { TrendingUp, Calendar, Target, DollarSign, Activity, PieChart as PieChartIcon } from 'lucide-react';
import { Transaction, BudgetCategory } from '../types/budget';
import { formatCurrency } from '../utils/currency';

interface AnalyticsProps {
  transactions: Transaction[];
  categories: BudgetCategory[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C'];

export const Analytics: React.FC<AnalyticsProps> = ({ transactions, categories }) => {
  const getMonthlyTrends = () => {
    const monthlyData = transactions.reduce((acc, transaction) => {
      const month = new Date(transaction.date).toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'short' 
      });
      
      if (!acc[month]) {
        acc[month] = { month, income: 0, expense: 0 };
      }
      
      acc[month][transaction.type] += transaction.amount;
      return acc;
    }, {} as Record<string, { month: string; income: number; expense: number }>);

    return Object.values(monthlyData).slice(-6);
  };

  const getCategoryPieData = () => {
    return categories
      .filter(cat => cat.spent > 0)
      .map(cat => ({
        name: cat.name,
        value: cat.spent,
        color: cat.color,
        percentage: ((cat.spent / categories.reduce((sum, c) => sum + c.spent, 0)) * 100).toFixed(1)
      }))
      .sort((a, b) => b.value - a.value);
  };

  const getDailySpending = () => {
    const dailyData = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, transaction) => {
        const date = new Date(transaction.date).toLocaleDateString('en-IN', { 
          month: 'short', 
          day: 'numeric' 
        });
        
        if (!acc[date]) {
          acc[date] = { date, amount: 0 };
        }
        
        acc[date].amount += transaction.amount;
        return acc;
      }, {} as Record<string, { date: string; amount: number }>);

    return Object.values(dailyData).slice(-14); // Last 14 days
  };

  const getBudgetVsSpentData = () => {
    return categories.map(cat => ({
      category: cat.name.length > 10 ? cat.name.substring(0, 10) + '...' : cat.name,
      budget: cat.limit,
      spent: cat.spent,
      remaining: Math.max(0, cat.limit - cat.spent),
      color: cat.color
    }));
  };

  const monthlyTrends = getMonthlyTrends();
  const categoryPieData = getCategoryPieData();
  const dailySpending = getDailySpending();
  const budgetVsSpent = getBudgetVsSpentData();

  const totalSpent = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalSpent;
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">
            Amount: {formatCurrency(data.value)}
          </p>
          <p className="text-sm text-gray-600">
            Percentage: {data.percentage}%
          </p>
        </div>
      );
    }
    return null;
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <Activity className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Data to Analyze</h3>
        <p className="text-gray-500">Start adding transactions to see beautiful charts and insights!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Spent</p>
              <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Total Income</p>
              <p className="text-2xl font-bold">{formatCurrency(totalIncome)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-200" />
          </div>
        </div>
        
        <div className={`rounded-lg p-6 text-white ${
          netBalance >= 0 
            ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
            : 'bg-gradient-to-r from-orange-500 to-red-500'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Net Balance</p>
              <p className="text-2xl font-bold">{formatCurrency(netBalance)}</p>
            </div>
            <TrendingUp className={`h-8 w-8 ${
              netBalance >= 0 ? 'text-blue-200' : 'text-orange-200'
            }`} />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Categories Used</p>
              <p className="text-2xl font-bold">{categories.filter(cat => cat.spent > 0).length}</p>
            </div>
            <Target className="h-8 w-8 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100">Transactions</p>
              <p className="text-2xl font-bold">{transactions.length}</p>
            </div>
            <Activity className="h-8 w-8 text-indigo-200" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Spending by Category - Pie Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <PieChartIcon className="h-5 w-5 mr-2" />
            Spending by Category
          </h3>
          {categoryPieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No spending data available
            </div>
          )}
        </div>

        {/* Monthly Income vs Expenses */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Monthly Income vs Expenses
          </h3>
          {monthlyTrends.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `₹${value/1000}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="income" fill="#10B981" name="Income" />
                <Bar dataKey="expense" fill="#EF4444" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No monthly data available
            </div>
          )}
        </div>

        {/* Daily Spending Trend */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Daily Spending Trend (Last 14 Days)
          </h3>
          {dailySpending.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dailySpending}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => `₹${value}`} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.3}
                  name="Daily Spending"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No daily spending data available
            </div>
          )}
        </div>

        {/* Budget vs Spent Comparison */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Budget vs Actual Spending
          </h3>
          {budgetVsSpent.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={budgetVsSpent} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(value) => `₹${value/1000}K`} />
                <YAxis dataKey="category" type="category" width={80} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="budget" fill="#94A3B8" name="Budget" />
                <Bar dataKey="spent" fill="#EF4444" name="Spent" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No budget comparison data available
            </div>
          )}
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Category Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Remaining
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage %
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => {
                const percentage = (category.spent / category.limit) * 100;
                const remaining = category.limit - category.spent;
                return (
                  <tr key={category.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-3"
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <span className="text-sm font-medium text-gray-900">
                          {category.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(category.limit)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(category.spent)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={remaining >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatCurrency(remaining)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${Math.min(percentage, 100)}%`,
                              backgroundColor: percentage > 100 ? '#EF4444' : category.color,
                            }}
                          ></div>
                        </div>
                        <span className={`text-sm font-medium ${
                          percentage > 100 ? 'text-red-600' : 'text-gray-900'
                        }`}>
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};