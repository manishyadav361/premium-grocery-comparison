import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Product } from '../data/mockData';

interface Alert {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  targetPrice: number;
  currentPrice: number;
  platform: string;
  type: 'price-drop' | 'restock';
  enabled: boolean;
  triggered?: boolean;
}

interface AppUser {
  name: string;
  phone?: string;
  email?: string;
  avatar?: string;
  isGuest?: boolean;
}

interface AppLocation {
  city: string;
  area: string;
  pincode: string;
}

interface SnackbarState {
  message: string;
  type: 'success' | 'error' | 'info';
  id: number;
}

interface AppContextType {
  user: AppUser | null;
  setUser: (user: AppUser | null) => void;
  location: AppLocation | null;
  setLocation: (location: AppLocation | null) => void;
  savedItems: Product[];
  addSavedItem: (item: Product) => void;
  removeSavedItem: (id: string) => void;
  isItemSaved: (id: string) => boolean;
  alerts: Alert[];
  addAlert: (alert: Omit<Alert, 'id'>) => void;
  removeAlert: (id: string) => void;
  toggleAlert: (id: string) => void;
  snackbar: SnackbarState | null;
  showSnackbar: (message: string, type?: 'success' | 'error' | 'info') => void;
  hasOnboarded: boolean;
  setHasOnboarded: (v: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [location, setLocation] = useState<AppLocation | null>(null);
  const [savedItems, setSavedItems] = useState<Product[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 'a1',
      productId: '1',
      productName: 'Oral-B Pro 100 Electric Toothbrush',
      productImage: 'https://images.unsplash.com/photo-1550985543-f1ea83691cd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      targetPrice: 599,
      currentPrice: 649,
      platform: 'zepto',
      type: 'price-drop',
      enabled: true,
      triggered: false,
    },
    {
      id: 'a2',
      productId: '8',
      productName: 'Himalaya Face Wash Neem',
      productImage: 'https://images.unsplash.com/photo-1761864293818-603c23655cee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      targetPrice: 90,
      currentPrice: 95,
      platform: 'instamart',
      type: 'restock',
      enabled: true,
      triggered: false,
    },
  ]);
  const [snackbar, setSnackbar] = useState<SnackbarState | null>(null);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  const addSavedItem = useCallback((item: Product) => {
    setSavedItems(prev => {
      if (prev.find(p => p.id === item.id)) return prev;
      return [...prev, item];
    });
  }, []);

  const removeSavedItem = useCallback((id: string) => {
    setSavedItems(prev => prev.filter(p => p.id !== id));
  }, []);

  const isItemSaved = useCallback((id: string) => {
    return savedItems.some(p => p.id === id);
  }, [savedItems]);

  const addAlert = useCallback((alert: Omit<Alert, 'id'>) => {
    const id = `alert-${Date.now()}`;
    setAlerts(prev => [...prev, { ...alert, id }]);
  }, []);

  const removeAlert = useCallback((id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  }, []);

  const toggleAlert = useCallback((id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  }, []);

  const showSnackbar = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setSnackbar({ message, type, id: Date.now() });
  }, []);

  useEffect(() => {
    if (snackbar) {
      const timer = setTimeout(() => setSnackbar(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [snackbar]);

  return (
    <AppContext.Provider value={{
      user, setUser,
      location, setLocation,
      savedItems, addSavedItem, removeSavedItem, isItemSaved,
      alerts, addAlert, removeAlert, toggleAlert,
      snackbar, showSnackbar,
      hasOnboarded, setHasOnboarded,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

export type { Alert, AppUser, AppLocation };
