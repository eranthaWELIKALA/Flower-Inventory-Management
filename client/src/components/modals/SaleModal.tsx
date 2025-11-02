import { useState } from 'react';
// REST API used via fetch; types exported from `src/lib/supabase.ts`
import type { Flower } from '../../lib/supabase';
import { X, Plus, Trash2 } from 'lucide-react';

interface SaleModalProps {
  flowers: Flower[];
  onClose: () => void;
  onSave: () => void;
}

interface SaleItemInput {
  flower_id: string;
  quantity: number;
  unit_price: number;
}

export function SaleModal({ flowers, onClose, onSave }: SaleModalProps) {
  const [items, setItems] = useState<SaleItemInput[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addItem = () => {
    setItems([...items, { flower_id: '', quantity: 1, unit_price: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof SaleItemInput, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    if (field === 'flower_id') {
      const flower = flowers.find(f => f.id === value);
      if (flower && flower.selling_price) {
        newItems[index].unit_price = flower.selling_price;
      }
    }

    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      setError('Please add at least one item');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const total = calculateTotal();

      // send sale + items to server; server will create sale, sale items and update stock
      const res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'}/sales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, total_amount: total, customer_name: customerName || null, customer_phone: customerPhone || null, payment_method: paymentMethod, notes: notes || null }),
      });

      if (!res.ok) throw new Error(await res.text());

      const sale = await res.json();

      onSave();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">New Sale</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Name
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Optional"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Phone
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Optional"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="mobile">Mobile Payment</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Items *
              </label>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-1 text-green-600 hover:text-green-700 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="flex gap-2 items-start p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <select
                      value={item.flower_id}
                      onChange={(e) => updateItem(index, 'flower_id', e.target.value)}
                      required
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select flower</option>
                      {flowers
                        .filter(f => f.current_stock > 0)
                        .map((flower) => (
                          <option key={flower.id} value={flower.id}>
                            {flower.name} ({flower.current_stock} available)
                          </option>
                        ))}
                    </select>

                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                      required
                      min="1"
                      max={flowers.find(f => f.id === item.flower_id)?.current_stock || 999}
                      placeholder="Qty"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />

                    <input
                      type="number"
                      step="0.01"
                      value={item.unit_price}
                      onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                      required
                      min="0"
                      placeholder="Price"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 min-w-[60px] text-right">
                      ${(item.quantity * item.unit_price).toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {items.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No items added yet. Click "Add Item" to get started.
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Optional notes..."
            />
          </div>

          {items.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-900">Total Amount:</span>
                <span className="text-2xl font-bold text-green-600">
                  ${calculateTotal().toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || items.length === 0}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Complete Sale'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
