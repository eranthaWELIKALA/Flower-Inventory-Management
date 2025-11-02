import { useState, useEffect } from 'react';
import type { Supplier } from '../../lib/supabase';
import { Plus, Search, Edit2, Users } from 'lucide-react';
import { SupplierModal } from '../modals/SupplierModal';

export function SuppliersTab() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      const data = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'}/suppliers`).then(r => r.json());
      setSuppliers(data || []);
    } catch (error) {
      console.error('Error loading suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSupplier(null);
  };

  const handleSave = async () => {
    await loadSuppliers();
    handleCloseModal();
  };

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact_person?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h2 className="text-2xl font-bold text-gray-900">Suppliers</h2>
          <p className="text-gray-600 mt-1">Manage your flower suppliers</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
          Add Supplier
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {filteredSuppliers.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            {searchTerm ? 'No suppliers found matching your search' : 'No suppliers added yet'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSuppliers.map((supplier) => (
            <div
              key={supplier.id}
              className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-900">{supplier.name}</h3>
                <button
                  onClick={() => handleEdit(supplier)}
                  className="text-green-600 hover:text-green-700 transition"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-sm">
                {supplier.contact_person && (
                  <div className="text-gray-700">
                    <span className="font-medium">Contact:</span> {supplier.contact_person}
                  </div>
                )}
                {supplier.email && (
                  <div className="text-gray-700">
                    <span className="font-medium">Email:</span> {supplier.email}
                  </div>
                )}
                {supplier.phone && (
                  <div className="text-gray-700">
                    <span className="font-medium">Phone:</span> {supplier.phone}
                  </div>
                )}
                {supplier.address && (
                  <div className="text-gray-700">
                    <span className="font-medium">Address:</span> {supplier.address}
                  </div>
                )}
                {supplier.notes && (
                  <div className="text-gray-600 italic mt-3 pt-3 border-t border-gray-200">
                    {supplier.notes}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <SupplierModal
          supplier={editingSupplier}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
