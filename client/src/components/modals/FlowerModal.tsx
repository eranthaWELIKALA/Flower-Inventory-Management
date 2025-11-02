import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
// REST API used via fetch; types exported from `src/lib/supabase.ts`
import type { Flower, Supplier } from '../../lib/supabase';
import { X } from 'lucide-react';

interface FlowerModalProps {
  flower: Flower | null;
  suppliers: Supplier[];
  onClose: () => void;
  onSave: () => void;
}

export function FlowerModal({ flower, suppliers, onClose, onSave }: FlowerModalProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    variety: '',
    color: '',
    supplier_id: '',
    current_stock: 0,
    unit: 'stem',
    cost_price: '',
    selling_price: '',
    reorder_level: 10,
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (flower) {
      setFormData({
        name: flower.name,
        variety: flower.variety || '',
        color: flower.color || '',
        supplier_id: flower.supplier_id || '',
        current_stock: flower.current_stock,
        unit: flower.unit,
        cost_price: flower.cost_price?.toString() || '',
        selling_price: flower.selling_price?.toString() || '',
        reorder_level: flower.reorder_level,
        notes: flower.notes || '',
      });
    }
  }, [flower]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const dataToSave = {
        name: formData.name,
        variety: formData.variety || null,
        color: formData.color || null,
        supplier_id: formData.supplier_id || null,
        current_stock: formData.current_stock,
        unit: formData.unit,
        cost_price: formData.cost_price ? parseFloat(formData.cost_price) : null,
        selling_price: formData.selling_price ? parseFloat(formData.selling_price) : null,
        reorder_level: formData.reorder_level,
        notes: formData.notes || null,
      };

      if (flower) {
        const res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'}/flowers/${flower.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSave),
        });
        if (!res.ok) throw new Error(await res.text());
      } else {
        const res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'}/flowers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSave),
        });
        if (!res.ok) throw new Error(await res.text());
      }

      onSave();
    } catch (err: any) {
      setError(err.message || t('app.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            {flower ? t('inventory.editFlower') : t('inventory.addNewFlower')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('inventory.flowerName')} *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={t('inventory.placeholder.flowerName')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('inventory.variety')}
              </label>
              <input
                type="text"
                value={formData.variety}
                onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={t('inventory.placeholder.variety')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('inventory.color')}
              </label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={t('inventory.placeholder.color')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('inventory.supplier')}
              </label>
              <select
                value={formData.supplier_id}
                onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">{t('inventory.noSupplier')}</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('inventory.unit')}
              </label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="stem">{t('inventory.stem')}</option>
                <option value="bunch">{t('inventory.bunch')}</option>
                <option value="bouquet">{t('inventory.bouquet')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('inventory.currentStock')} *
              </label>
              <input
                type="number"
                value={formData.current_stock}
                onChange={(e) => setFormData({ ...formData, current_stock: parseInt(e.target.value) || 0 })}
                required
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('inventory.reorderLevel')}
              </label>
              <input
                type="number"
                value={formData.reorder_level}
                onChange={(e) => setFormData({ ...formData, reorder_level: parseInt(e.target.value) || 0 })}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('inventory.costPrice')}
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.cost_price}
                onChange={(e) => setFormData({ ...formData, cost_price: e.target.value })}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={t('inventory.placeholder.costPrice')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('inventory.sellingPrice')}
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.selling_price}
                onChange={(e) => setFormData({ ...formData, selling_price: e.target.value })}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={t('inventory.placeholder.sellingPrice')}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('inventory.notes')}
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={t('inventory.placeholder.notes')}
              />
            </div>
          </div>

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
              {t('app.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-50"
            >
              {loading ? t('inventory.saving') : t('app.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
