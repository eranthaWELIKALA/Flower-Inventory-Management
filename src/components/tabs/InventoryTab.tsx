import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { Flower, Supplier } from '../../lib/supabase';
import { Plus, Search, Edit2, AlertCircle, Package } from 'lucide-react';
import { FlowerModal } from '../modals/FlowerModal';

export function InventoryTab() {
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingFlower, setEditingFlower] = useState<Flower | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [flowersRes, suppliersRes] = await Promise.all([
        supabase
          .from('flowers')
          .select('*, supplier:suppliers(*)')
          .order('name'),
        supabase
          .from('suppliers')
          .select('*')
          .order('name')
      ]);

      if (flowersRes.error) throw flowersRes.error;
      if (suppliersRes.error) throw suppliersRes.error;

      setFlowers(flowersRes.data || []);
      setSuppliers(suppliersRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (flower: Flower) => {
    setEditingFlower(flower);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingFlower(null);
  };

  const handleSave = async () => {
    await loadData();
    handleCloseModal();
  };

  const filteredFlowers = flowers.filter(flower =>
    flower.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    flower.variety?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    flower.color?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockCount = flowers.filter(f => f.current_stock <= f.reorder_level).length;

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
          <h2 className="text-2xl font-bold text-gray-900">Flower Inventory</h2>
          <p className="text-gray-600 mt-1">Manage your flower stock and pricing</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
          Add Flower
        </button>
      </div>

      {lowStockCount > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-900">Low Stock Alert</h3>
            <p className="text-sm text-yellow-800 mt-1">
              {lowStockCount} {lowStockCount === 1 ? 'item is' : 'items are'} at or below reorder level
            </p>
          </div>
        </div>
      )}

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search flowers by name, variety, or color..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {filteredFlowers.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            {searchTerm ? 'No flowers found matching your search' : 'No flowers in inventory yet'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Flower
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Cost Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Selling Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredFlowers.map((flower) => (
                <tr key={flower.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{flower.name}</div>
                      {flower.variety && (
                        <div className="text-sm text-gray-600">{flower.variety}</div>
                      )}
                      {flower.color && (
                        <span className="inline-block mt-1 px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                          {flower.color}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${
                        flower.current_stock <= flower.reorder_level
                          ? 'text-red-600'
                          : 'text-gray-900'
                      }`}>
                        {flower.current_stock}
                      </span>
                      <span className="text-sm text-gray-500">{flower.unit}</span>
                    </div>
                    {flower.current_stock <= flower.reorder_level && (
                      <div className="text-xs text-red-600 mt-1">Low stock</div>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-gray-900">
                      ${flower.cost_price?.toFixed(2) || '0.00'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-medium text-gray-900">
                      ${flower.selling_price?.toFixed(2) || '0.00'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-600">
                      {flower.supplier?.name || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={() => handleEdit(flower)}
                      className="inline-flex items-center gap-1 text-green-600 hover:text-green-700 font-medium transition"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <FlowerModal
          flower={editingFlower}
          suppliers={suppliers}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
