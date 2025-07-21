import React, { useState } from 'react';
import { Search, Filter, Trash2, TrendingUp, TrendingDown, Calendar, Receipt, IndianRupee } from 'lucide-react';
import { Transaction } from '../types/budget';
import { formatCurrency } from '../utils/currency';

interface TransactionHistoryProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  onDeleteTransaction,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  const filteredTransactions = transactions
    .filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || transaction.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return b.amount - a.amount;
      }
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 md:mb-0 flex items-center">
          <Receipt className="h-6 w-6 mr-2" />
          Transaction History
        </h2>
        
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'income' | 'expense')}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expenses</option>
            </select>
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
          </select>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Receipt className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-gray-500 text-lg font-medium">No transactions found</p>
            <p className="text-gray-400 text-sm">Start tracking your income and expenses</p>
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-center space-x-4">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                  transaction.type === 'income' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  {transaction.type === 'income' ? (
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  ) : (
                    <TrendingDown className="h-6 w-6 text-red-600" />
                  )}
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 text-base">{transaction.description}</h3>
                  <p className="text-sm text-gray-500 flex items-center">
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                      transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                    }`}></span>
                    {transaction.category} • {formatDate(transaction.date)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <span className={`font-bold text-lg ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </span>
                  <p className="text-xs text-gray-400">
                    {transaction.type === 'income' ? 'Income' : 'Expense'}
                  </p>
                </div>
                
                <button
                  onClick={() => onDeleteTransaction(transaction.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-2 hover:bg-red-50 rounded-md"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};