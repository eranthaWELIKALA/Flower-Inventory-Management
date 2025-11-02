import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, UserPlus, Flower2, Settings, Cog } from 'lucide-react';
import { ThemeSettings } from './ThemeSettings';
import { LanguageSwitcher } from './LanguageSwitcher';

export function AuthForm() {
  const { t } = useTranslation();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showThemeSettings, setShowThemeSettings] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
        setError(t('auth.accountCreated'));
        setIsSignUp(false);
      } else {
        await signIn(email, password);
      }
    } catch (err: any) {
      setError(err.message || t('app.error'));
    } finally {
      setLoading(false);
    }
  };

  if (showThemeSettings) {
    return <ThemeSettings onBack={() => setShowThemeSettings(false)} />;
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4
      bg-gradient-to-br from-green-50 via-white to-green-100"
      style={{ 
        background: 'linear-gradient(135deg, var(--color-background) 0%, var(--color-surface) 100%)'
      }}
    >
      <div className="w-full max-w-md relative">
        {/* Language Switcher */}
        <div className="absolute top-4 left-4 z-20">
          <LanguageSwitcher />
        </div>

        {/* Theme Settings Button */}
        <button
          onClick={() => setShowThemeSettings(true)}
          className="absolute top-6 right-6 p-3 rounded-full transition-all duration-200 z-10 border-2 hover:scale-110 hover:shadow-lg group"
          style={{ 
            color: 'var(--color-primary)',
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-primary)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}
          title="Theme Settings"
        >
          <Cog className="w-6 h-6 group-hover:rotate-90 transition-transform duration-200" />
        </button>

        {/* System-style Login Card */}
        <div 
          className="rounded-2xl shadow-2xl border backdrop-blur-sm"
          style={{ 
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}
        >
          {/* Header with system-like styling */}
          <div className="p-8 pb-6">
            <div className="flex flex-col items-center mb-8">
              <div 
                className="p-4 rounded-full mb-4"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <Flower2 className="w-8 h-8 text-white" />
              </div>
              <h1 
                className="text-2xl font-semibold mb-1"
                style={{ color: 'var(--color-text)' }}
              >
                {t('app.title')}
              </h1>
              <p 
                className="text-sm text-center"
                style={{ color: 'var(--color-textSecondary)' }}
              >
                {isSignUp ? t('auth.createAccount') : t('auth.signIn')}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--color-text)' }}
                >
                  {t('auth.email')}
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                    '--tw-ring-color': 'var(--color-primary)'
                  }}
                  placeholder={t('auth.email')}
                />
              </div>

              <div>
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--color-text)' }}
                >
                  {t('auth.password')}
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                    '--tw-ring-color': 'var(--color-primary)'
                  }}
                  placeholder={t('auth.password')}
                />
              </div>

              {error && (
                <div 
                  className="p-3 rounded-lg text-sm"
                  style={{ 
                    backgroundColor: 'var(--color-error)',
                    color: 'white'
                  }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full font-medium py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  backgroundColor: 'var(--color-primary)',
                  color: 'white'
                }}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : isSignUp ? (
                  <>
                    <UserPlus className="w-5 h-5" />
                    {t('auth.createAccount')}
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    {t('auth.signIn')}
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                }}
                className="text-sm font-medium transition-colors"
                style={{ color: 'var(--color-primary)' }}
              >
                {isSignUp ? t('auth.alreadyHaveAccount') : t('auth.dontHaveAccount')}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div 
            className="px-8 py-4 border-t text-center"
            style={{ 
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-background)'
            }}
          >
            <p 
              className="text-xs"
              style={{ color: 'var(--color-textSecondary)' }}
            >
              {t('app.title')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

