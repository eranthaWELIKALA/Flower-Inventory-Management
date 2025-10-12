import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Flower2, LogOut, Package, ShoppingCart, Users, TrendingUp } from 'lucide-react';
import { InventoryTab } from './tabs/InventoryTab';
import { SalesTab } from './tabs/SalesTab';
import { SuppliersTab } from './tabs/SuppliersTab';

type Tab = 'inventory' | 'sales' | 'suppliers';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('inventory');
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const tabs = [
    { id: 'inventory' as Tab, label: 'Inventory', icon: Package },
    { id: 'sales' as Tab, label: 'Sales', icon: ShoppingCart },
    { id: 'suppliers' as Tab, label: 'Suppliers', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-green-500 p-2 rounded-lg">
                <Flower2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Flower Shop</h1>
                <p className="text-xs text-gray-600">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex gap-2 mb-6 bg-white p-1 rounded-lg border border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium transition ${
                  activeTab === tab.id
                    ? 'bg-green-500 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {activeTab === 'inventory' && <InventoryTab />}
          {activeTab === 'sales' && <SalesTab />}
          {activeTab === 'suppliers' && <SuppliersTab />}
        </div>
      </div>
    </div>
  );
}
