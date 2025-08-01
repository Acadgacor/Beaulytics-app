import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  // Add other product properties as needed
}

interface Notification {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface CompareContextType {
  compareList: Product[];
  notification: Notification | null;
  maxCompareItems: number;
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompareList: () => void;
  isInCompareList: (productId: string) => boolean;
  reorderCompareList: (startIndex: number, endIndex: number) => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const useCompare = (): CompareContextType => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};

interface CompareProviderProps {
  children: ReactNode;
}

export const CompareProvider = ({ children }: CompareProviderProps) => {
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [notification, setNotification] = useState<Notification | null>(null);
  const MAX_COMPARE_ITEMS = 3;

  useEffect(() => {
    const savedList = localStorage.getItem('compareList');
    if (savedList) {
      setCompareList(JSON.parse(savedList));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('compareList', JSON.stringify(compareList));
  }, [compareList]);

  const addToCompare = (product: Product) => {
    setCompareList((prevList) => {
      if (prevList.some((item) => item.id === product.id)) {
        setNotification({
          message: `${product.name} is already in your compare list`,
          type: 'info',
        });
        return prevList;
      }

      if (prevList.length >= MAX_COMPARE_ITEMS) {
        setNotification({
          message: `You can only compare up to ${MAX_COMPARE_ITEMS} products. Remove one to add another.`,
          type: 'warning',
        });
        return prevList;
      }

      setNotification({
        message: `${product.name} added to compare list`,
        type: 'success',
      });
      return [...prevList, product];
    });

    setTimeout(() => setNotification(null), 3000);
  };

  const removeFromCompare = (productId: string) => {
    setCompareList((prevList) => prevList.filter((item) => item.id !== productId));
    setNotification({
      message: 'Product removed from compare list',
      type: 'info',
    });

    setTimeout(() => setNotification(null), 3000);
  };

  const clearCompareList = () => {
    setCompareList([]);
    setNotification({
      message: 'Compare list cleared',
      type: 'info',
    });

    setTimeout(() => setNotification(null), 3000);
  };

  const isInCompareList = (productId: string) => {
    return compareList.some((item) => item.id === productId);
  };

  const reorderCompareList = (startIndex: number, endIndex: number) => {
    const result = Array.from(compareList);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setCompareList(result);
  };

  const value: CompareContextType = {
    compareList,
    notification,
    maxCompareItems: MAX_COMPARE_ITEMS,
    addToCompare,
    removeFromCompare,
    clearCompareList,
    isInCompareList,
    reorderCompareList,
  };

  return (
    <CompareContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {notification && (
          <motion.div
            className="notification"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              backgroundColor:
                notification.type === 'success'
                  ? 'var(--success)'
                  : notification.type === 'warning'
                  ? '#FF9800'
                  : notification.type === 'info'
                  ? '#2196F3'
                  : 'var(--error)',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '4px',
              zIndex: 1000,
              boxShadow: 'var(--shadow-md)',
            }}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>
    </CompareContext.Provider>
  );
};

export default CompareContext;
