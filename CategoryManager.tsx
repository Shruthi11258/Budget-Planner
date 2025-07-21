import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Palette } from 'lucide-react';
import { BudgetCategory } from '../types/budget';
import { formatCurrency } from '../utils/currency';

interface CategoryManagerProps {
  categories: BudgetCategory[];
  onUpdateCategory: (categoryId: string, updates: Partial<BudgetCategory>) => void;
  onAddCategory: (category: Omit<BudgetCategory, 'id' | 'spent'>) => void;
  onDeleteCategory: (categoryId: string) => void;
}

const PRESET_COLORS = [
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', 
  '#EC4899', '#6366F1', '#14B8A6', '#F97316', '#84CC16',
  '#06B6D4', '#8B5A2B', '#6B7280', '#DC2626', '#7C3AED'
];

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  onUpdateCategory,
  onAddCategory,
  onDeleteCategory,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    limit: '',
    color: PRESET_COLORS[0],
  });

  const handleEdit = (category: BudgetCategory) => {
    setEditingId(category.id);
    setEditForm({
      name: category.name,
      limit: category.limit.toString(),
      color: category.color,
    });
  };

  const handleSave = () => {
    if (editingId && editForm.name && editForm.limit) {
      onUpdateCategory(editingId, {
        name: editForm.name,
        limit: parseFloat(editForm.limit),
        color: editForm.color,
      });
      setEditingId(null);
    }
  };

  const handleAdd = () => {
    if (editForm.name && editForm.limit) {
      onAddCategory({
        name: editForm.name,
        limit: parseFloat(editForm.limit),
        color: editForm.color,
        icon: 'Tag',
      });
      setEditForm({ name: '', limit: '', color: PRESET_COLORS[0] });
      setShowAddForm(false);
      
      // Show success message
      alert('📁 Category added successfully!');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowAddForm(false);
    setEditForm({ name: '', limit: '', color: PRESET_COLORS[0] });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Manage Categories</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </button>
      </div>

      {/* Add New Category Form */}
      {showAddForm && (
        <div className="mb-6 p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
          <h4 className="font-medium text-gray-900 mb-3">Add New Category</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Name
              </label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Groceries, Gym"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Budget Limit (₹)
              </label>
              <input
                type="number"
                value={editForm.limit}
                onChange={(e) => setEditForm(prev => ({ ...prev, limit: e.target.value }))}
                placeholder="5000"
                min="0"
                step="100"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color
              </label>
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.slice(0, 8).map((color) => (
                  <button
                    key={color}
                    onClick={() => setEditForm(prev => ({ ...prev, color }))}
                    className={`w-6 h-6 rounded-full border-2 ${
                      editForm.color === color ? 'border-gray-800' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAdd}
              className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
            >
              <Save className="h-4 w-4 mr-1" />
              Add
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200"
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="space-y-3">
        {categories.map((category) => (
          <div key={category.id} className="p-4 border border-gray-200 rounded-lg">
            {editingId === category.id ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    value={editForm.limit}
                    onChange={(e) => setEditForm(prev => ({ ...prev, limit: e.target.value }))}
                    min="0"
                    step="100"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {PRESET_COLORS.slice(0, 6).map((color) => (
                      <button
                        key={color}
                        onClick={() => setEditForm(prev => ({ ...prev, color }))}
                        className={`w-5 h-5 rounded-full border ${
                          editForm.color === color ? 'border-gray-800' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <button
                    onClick={handleSave}
                    className="p-1 text-green-600 hover:text-green-700"
                  >
                    <Save className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="p-1 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <div>
                    <h4 className="font-medium text-gray-900">{category.name}</h4>
                    <p className="text-sm text-gray-500">
                      {formatCurrency(category.spent)} / {formatCurrency(category.limit)}
                      <span className="ml-2">
                        ({((category.spent / category.limit) * 100).toFixed(1)}% used)
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors duration-200"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  {categories.length > 1 && (
                    <button
                      onClick={() => onDeleteCategory(category.id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            )}
            
            {/* Progress Bar */}
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min((category.spent / category.limit) * 100, 100)}%`,
                    backgroundColor: category.color,
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};