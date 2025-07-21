import React, { useState } from 'react';
import { Plus, DollarSign, Calendar, Tag, FileText, Calculator, Receipt } from 'lucide-react';
import { Transaction } from '../types/budget';

interface AddTransactionProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => void;
  categories: string[];
}

export const AddTransaction: React.FC<AddTransactionProps> = ({
  onAddTransaction,
  categories,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [quickAmount, setQuickAmount] = useState('');
  const [formData, setFormData] = useState({
    type: 'income' as 'income' | 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.category || !formData.description) return;

    onAddTransaction({
      type: formData.type,
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      date: formData.date,
    });

    // Show success message
    const message = formData.type === 'income' 
      ? '💰 Income added successfully!' 
      : '💸 Expense saved successfully!';
    alert(message);

    setFormData({
      type: 'income',
      amount: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
    setIsOpen(false);
  };

  const handleQuickAmount = (amount: string) => {
    setFormData(prev => ({ ...prev, amount }));
    setQuickAmount(amount);
  };

  const quickAmounts = ['100', '500', '1000', '2000', '5000'];

  // Different quick amounts for income vs expense
  const incomeQuickAmounts = ['5000', '10000', '25000', '50000', '100000'];
  const expenseQuickAmounts = ['100', '500', '1000', '2000', '5000'];
  const currentQuickAmounts = formData.type === 'income' ? incomeQuickAmounts : expenseQuickAmounts;

  // Different categories for income vs expense
  const incomeCategories = ['Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Other Income'];
  const expenseCategories = categories;
  const currentCategories = formData.type === 'income' ? incomeCategories : expenseCategories;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'amount') {
      setQuickAmount(value);
    }
    if (name === 'type') {
      // Reset form when switching between income/expense
      setFormData(prev => ({
        ...prev,
        [name]: value,
        category: '',
        description: '',
        amount: '',
      }));
      setQuickAmount('');
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-105"
      >
        <Plus className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Receipt className="h-6 w-6 mr-2 text-blue-600" />
                  {formData.type === 'income' ? 'Add Income' : 'Add Expense'}
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Plus className="h-6 w-6 rotate-45" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Transaction Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What type of transaction is this?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        formData.type === 'income'
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      💰 Income
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        formData.type === 'expense'
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      💸 Expense
                    </button>
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calculator className="h-4 w-4 inline mr-1" />
                    {formData.type === 'income' ? 'How much did you earn?' : 'How much did you spend?'} (₹)
                  </label>
                  
                  {/* Quick Amount Buttons */}
                  <div className="grid grid-cols-5 gap-2 mb-3">
                    {currentQuickAmounts.map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => handleQuickAmount(amount)}
                        className={`p-2 text-sm rounded-md border transition-all duration-200 ${
                          quickAmount === amount
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        ₹{amount}
                      </button>
                    ))}
                  </div>
                  
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder={formData.type === 'income' ? 'Enter income amount...' : 'Enter expense amount...'}
                    step="1"
                    min="0"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-medium"
                    required
                  />
                  {formData.amount && (
                    <p className="text-sm text-gray-500 mt-1">
                      Amount: <span className="font-semibold text-gray-700">₹{parseFloat(formData.amount || '0').toLocaleString('en-IN')}</span>
                    </p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Tag className="h-4 w-4 inline mr-1" />
                    {formData.type === 'income' ? 'What type of income is this?' : 'What category is this expense?'}
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                    required
                  >
                    <option value="">{formData.type === 'income' ? 'Choose income type...' : 'Choose expense category...'}</option>
                    {currentCategories.map((category) => (
                      <option key={category} value={category}>
                        📁 {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="h-4 w-4 inline mr-1" />
                    {formData.type === 'income' ? 'Description of income source' : 'What did you buy/pay for?'}
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder={
                      formData.type === 'income' 
                        ? 'e.g., Monthly salary, Freelance project, Investment returns...'
                        : 'e.g., Lunch at restaurant, Grocery shopping, Uber ride...'
                    }
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    required
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    {formData.type === 'income' ? 'When did you receive this?' : 'When did you spend this?'}
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                  >
                    {formData.type === 'income' ? '💰 Add Income' : '💸 Add Expense'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};