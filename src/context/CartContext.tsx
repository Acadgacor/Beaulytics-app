import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  price: number;
}

interface CartItem extends Product {
  quantity: number;
}

interface Notification {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  notification: Notification | null;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((item) => item.id === product.id);

      if (existingItemIndex >= 0) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      } else {
        return [...prevCart, { ...product, quantity }];
      }
    });

    setNotification({
      message: `${product.name} added to cart`,
      type: 'success',
    });

    setTimeout(() => setNotification(null), 3000);
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const toggleCart = () => {
    setIsCartOpen((prev) => !prev);
  };

  const value: CartContextType = {
    cart,
    isCartOpen,
    notification,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    toggleCart,
  };

  return (
    <CartContext.Provider value={value}>
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
                notification.type === 'success' ? 'var(--success)' : 'var(--error)',
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
    </CartContext.Provider>
  );
};

export default CartContext;
