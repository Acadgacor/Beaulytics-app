import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaTrash, FaArrowRight } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import Image from 'next/image';

const CartSidebar = () => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, isCartOpen, toggleCart } = useCart();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isCartOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        toggleCart();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCartOpen, toggleCart]);

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isCartOpen]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />
          <motion.div
            ref={sidebarRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 w-full max-w-md h-full bg-white z-50 flex flex-col shadow-lg"
          >
            <div className="flex justify-between items-center p-6 border-b border-light-gray">
              <h3 className="text-xl font-semibold m-0">Your Cart ({cart.length})</h3>
              <button onClick={toggleCart} className="bg-none border-none text-xl cursor-pointer text-dark-gray hover:text-black">
                <FaTimes />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center flex-1">
                <p className="text-dark-gray mb-6">Your cart is empty</p>
                <Link href="/products" passHref>
                  <a
                    onClick={toggleCart}
                    className="bg-primary text-black font-semibold py-3 px-6 rounded-lg transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-md"
                  >
                    Shop Now
                  </a>
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-6">
                  <AnimatePresence>
                    {cart.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center py-4 border-b border-light-gray last:border-b-0"
                      >
                        <Image
                          src={item.image || '/images/products/placeholder.jpg'}
                          alt={item.name}
                          width={70}
                          height={70}
                          className="object-cover rounded-lg mr-4"
                        />
                        <div className="flex-1">
                          <h4 className="text-base font-semibold m-0 mb-1">{item.name}</h4>
                          <p className="text-sm text-dark-gray m-0 mb-2 capitalize">{item.category}</p>
                          <p className="font-semibold m-0 mb-2">
                            Rp {(item.price * 15000).toLocaleString('id-ID')}
                          </p>
                          <div className="flex items-center">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-6 h-6 flex items-center justify-center bg-light-gray border-none rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              -
                            </button>
                            <span className="mx-2 text-sm min-w-[20px] text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center bg-light-gray border-none rounded-md cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="bg-none border-none text-dark-gray cursor-pointer p-2 ml-2 hover:text-error"
                        >
                          <FaTrash />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                <div className="p-6 border-t border-light-gray">
                  <div className="flex justify-between font-semibold text-lg mb-6">
                    <span>Subtotal:</span>
                    <span>Rp {(getTotalPrice() * 15000).toLocaleString('id-ID')}</span>
                  </div>
                  <Link href="/checkout" passHref>
                    <a
                      onClick={toggleCart}
                      className="w-full bg-primary text-black font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 mb-4 transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-md"
                    >
                      Checkout <FaArrowRight />
                    </a>
                  </Link>
                  <Link href="/cart" passHref>
                    <a
                      onClick={toggleCart}
                      className="w-full bg-transparent border border-medium-gray rounded-lg py-3 px-6 text-center transition-colors duration-300 ease-in-out hover:bg-light-gray"
                    >
                      View Cart
                    </a>
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
