import { useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useCart } from '../src/context/CartContext';
import { Layout } from '../src/components/layout/Layout';
import Image from 'next/image';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, isCartOpen, toggleCart } = useCart();

  useEffect(() => {
    if (isCartOpen) {
      toggleCart();
    }
  }, [isCartOpen, toggleCart]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Your Shopping Cart</h1>
          <p className="text-dark-gray">{cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        {cart.length === 0 ? (
          <div className="text-center p-16 bg-white rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-dark-gray mb-8">Looks like you haven't added any products to your cart yet.</p>
            <Link href="/products" passHref>
              <a className="inline-flex items-center gap-2 bg-primary text-black font-semibold py-3 px-6 rounded-lg transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-md">
                Browse Products <FaArrowRight />
              </a>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6 overflow-hidden">
              <div className="hidden md:grid grid-cols-6 gap-4 pb-4 border-b border-light-gray font-semibold">
                <span className="col-span-3">Product</span>
                <span>Price</span>
                <span>Quantity</span>
                <span className="text-right">Total</span>
              </div>
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid md:grid-cols-6 gap-4 items-center py-6 border-b border-light-gray last:border-b-0"
                  >
                    <div className="col-span-3 flex items-center gap-4">
                      <Image src={item.image || '/images/products/placeholder.jpg'} alt={item.name} width={80} height={80} className="object-cover rounded-lg" />
                      <div>
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <p className="text-sm text-dark-gray capitalize">{item.category}</p>
                      </div>
                    </div>
                    <div className="font-medium">Rp {(item.price * 15000).toLocaleString('id-ID')}</div>
                    <div className="flex items-center">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="w-8 h-8 flex items-center justify-center bg-light-gray rounded-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed">-</button>
                      <input type="number" min="1" value={item.quantity} onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)} className="w-12 h-8 text-center border-y border-light-gray" />
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center bg-light-gray rounded-md font-semibold">+</button>
                    </div>
                    <div className="font-semibold text-right">Rp {(item.price * item.quantity * 15000).toLocaleString('id-ID')}</div>
                    <button onClick={() => removeFromCart(item.id)} className="text-dark-gray hover:text-error transition-colors justify-self-end">
                      <FaTrash />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 self-start sticky top-8">
              <h3 className="text-xl font-semibold mb-6 pb-4 border-b border-light-gray">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between"><span>Subtotal</span><span>Rp {(getTotalPrice() * 15000).toLocaleString('id-ID')}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>Free</span></div>
                <div className="flex justify-between"><span>Tax (10%)</span><span>Rp {(getTotalPrice() * 0.1 * 15000).toLocaleString('id-ID')}</span></div>
                <hr className="my-4" />
                <div className="flex justify-between font-bold text-lg"><span>Total</span><span>Rp {(getTotalPrice() * 1.1 * 15000).toLocaleString('id-ID')}</span></div>
              </div>
              <Link href="/checkout" passHref>
                <a className="block w-full mt-6 bg-primary text-black font-semibold py-3 rounded-lg text-center transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-md">
                  Proceed to Checkout
                </a>
              </Link>
              <Link href="/products" passHref>
                <a className="block w-full mt-4 bg-transparent border border-medium-gray py-3 rounded-lg text-center flex items-center justify-center gap-2 transition-colors hover:bg-light-gray">
                  <FaArrowLeft /> Continue Shopping
                </a>
              </Link>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;
