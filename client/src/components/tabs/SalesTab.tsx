import { useState, useEffect } from 'react';
// REST API client used via fetch; `supabase` module kept for type exports
import type { Flower, Sale, SaleItem } from '../../lib/supabase';
import { Plus, ShoppingCart, Calendar } from 'lucide-react';
import { SaleModal } from '../modals/SaleModal';

export function SalesTab() {
  const [sales, setSales] = useState<(Sale & { items?: SaleItem[] })[]>([]);
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [salesRes, flowersRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'}/sales`).then(r => r.json()),
        fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'}/flowers`).then(r => r.json()),
      ]);

      const salesWithItems = salesRes?.map((s: any) => ({ ...s, items: s.items })) || [];
      setSales(salesWithItems);
      setFlowers(flowersRes || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    await loadData();
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sales History</h2>
          <p className="text-gray-600 mt-1">Record and track your flower sales</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
          New Sale
        </button>
      </div>

      {sales.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No sales recorded yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sales.map((sale) => (
            <div key={sale.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(sale.sale_date).toLocaleString()}
                  </div>
                  {sale.customer_name && (
                    <div className="text-sm text-gray-700">
                      Customer: <span className="font-medium">{sale.customer_name}</span>
                      {sale.customer_phone && <span className="ml-2">({sale.customer_phone})</span>}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    ${sale.total_amount.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">{sale.payment_method}</div>
                </div>
              </div>

              {sale.items && sale.items.length > 0 && (
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="space-y-2">
                    {sale.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                        <div className="flex-1">
                          <span className="font-medium">{item.flower?.name}</span>
                          <span className="text-gray-600 ml-2">× {item.quantity}</span>
                        </div>
                        <div className="text-gray-900">
                          ${item.subtotal.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {sale.notes && (
                <div className="mt-3 text-sm text-gray-600 italic">
                  Note: {sale.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <SaleModal
          flowers={flowers}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
