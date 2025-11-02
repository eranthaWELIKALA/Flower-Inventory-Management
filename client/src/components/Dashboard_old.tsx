import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Flower2, LogOut, Package, ShoppingCart, Users, Settings } from 'lucide-react';
import { InventoryTab } from './tabs/InventoryTab';
import { SalesTab } from './tabs/SalesTab';
import { SuppliersTab } from './tabs/SuppliersTab';
import { ThemeSettings } from './ThemeSettings';

type Tab = 'inventory' | 'sales' | 'suppliers' | 'settings';

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
    { id: 'settings' as Tab, label: 'Settings', icon: Settings },
  ];

  if (activeTab === 'settings') {
    return <ThemeSettings onBack={() => setActiveTab('inventory')} />;
  }

  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      <header 
        className="sticky top-0 z-10 border-b"
        style={{ 
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <Flower2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 
                  className="text-xl font-bold"
                  style={{ color: 'var(--color-text)' }}
                >
                  Flower Shop
                </h1>
                <p 
                  className="text-xs"
                  style={{ color: 'var(--color-textSecondary)' }}
                >
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
              style={{ 
                color: 'var(--color-text)',
                backgroundColor: 'transparent'
              }}
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav 
          className="flex gap-2 mb-6 p-1 rounded-lg border"
          style={{ 
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)'
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium transition ${
                  activeTab === tab.id
                    ? 'text-white shadow-sm'
                    : 'hover:opacity-80'
                }`}
                style={{
                  backgroundColor: activeTab === tab.id ? 'var(--color-primary)' : 'transparent',
                  color: activeTab === tab.id ? 'white' : 'var(--color-text)'
                }}
              >
                <Icon className="w-5 h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div 
          className="rounded-xl shadow-sm border p-6"
          style={{ 
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)'
          }}
        >
          {activeTab === 'inventory' && <InventoryTab />}
          {activeTab === 'sales' && <SalesTab />}
          {activeTab === 'suppliers' && <SuppliersTab />}
        </div>
      </div>
    </div>
  );
}
