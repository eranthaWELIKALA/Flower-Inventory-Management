import { createContext, useContext, useEffect, useState } from 'react';

type User = { id: string; email: string } | null;

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');
    setUser(userJson ? JSON.parse(userJson) : null);
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000/auth'}/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error(await res.text());
    const body = await res.json();
    localStorage.setItem('token', body.token);
    localStorage.setItem('user', JSON.stringify(body.user));
    setUser(body.user);
  };

  const signUp = async (email: string, password: string) => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000/auth'}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error(await res.text());
    const body = await res.json();
    localStorage.setItem('token', body.token);
    localStorage.setItem('user', JSON.stringify(body.user));
    setUser(body.user);
  };

  const signOut = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
