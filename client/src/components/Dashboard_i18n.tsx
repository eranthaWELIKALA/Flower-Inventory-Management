import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { Flower2, LogOut, Package, ShoppingCart, Users, Settings } from 'lucide-react';
import { InventoryTab } from './tabs/InventoryTab';
import { SalesTab } from './tabs/SalesTab';
import { SuppliersTab } from './tabs/SuppliersTab';
import { ThemeSettings } from './ThemeSettings';
import { LanguageSwitcher } from './LanguageSwitcher';

type Tab = 'inventory' | 'sales' | 'suppliers' | 'settings';

export function Dashboard() {
  const { t } = useTranslation();
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
    { id: 'inventory' as Tab, label: t('navigation.inventory'), icon: Package },
    { id: 'sales' as Tab, label: t('navigation.sales'), icon: ShoppingCart },
    { id: 'suppliers' as Tab, label: t('navigation.suppliers'), icon: Users },
    { id: 'settings' as Tab, label: t('navigation.settings'), icon: Settings },
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
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
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
                  {t('app.title')}
                </h1>
                <p 
                  className="text-sm"
                  style={{ color: 'var(--color-textSecondary)' }}
                >
                  {user?.email}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
                style={{ 
                  color: 'var(--color-text)',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--color-border)'
                }}
              >
                <LogOut className="w-4 h-4" />
                {t('auth.signOut')}
              </button>
            </div>
          </div>
        </div>

        <nav className="px-6">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-t-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2'
                    : 'hover:bg-opacity-50'
                }`}
                style={{
                  color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text)',
                  backgroundColor: activeTab === tab.id ? 'transparent' : 'transparent',
                  borderBottomColor: activeTab === tab.id ? 'var(--color-primary)' : 'transparent'
                }}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </nav>
      </header>

      <main className="p-6">
        {activeTab === 'inventory' && <InventoryTab />}
        {activeTab === 'sales' && <SalesTab />}
        {activeTab === 'suppliers' && <SuppliersTab />}
      </main>
    </div>
  );
}

