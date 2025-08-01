import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FaLock, FaCreditCard, FaPaypal, FaArrowLeft, FaCheck } from 'react-icons/fa';
import { useCart } from '../src/context/CartContext';
import { Layout } from '../src/components/layout/Layout';
import Image from 'next/image';

const CheckoutPage = () => {
  const router = useRouter();
  const { cart, getTotalPrice, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [isProcessing, setIsProcessing] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    firstName: '', lastName: '', email: '', phone: '', address: '', city: '', state: '', zipCode: '', country: 'Indonesia',
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '', cardName: '', expiry: '', cvv: '',
  });

  const formatToRupiah = (price: number) => `Rp ${(price * 15000).toLocaleString('id-ID')}`;

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleShippingSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handlePaymentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push('/payment');
  };

  const handleCompleteOrder = () => {
    router.push('/');
  };

  const renderShippingForm = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <h2 className="text-2xl font-semibold mb-6">Shipping Information</h2>
      <form onSubmit={handleShippingSubmit} className="space-y-6">
        {/* Form fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <input type="text" id="firstName" name="firstName" value={shippingInfo.firstName} onChange={handleShippingChange} required className="w-full p-3 border border-medium-gray rounded-lg" />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <input type="text" id="lastName" name="lastName" value={shippingInfo.lastName} onChange={handleShippingChange} required className="w-full p-3 border border-medium-gray rounded-lg" />
          </div>
        </div>
        <button type="submit" className="w-full bg-primary text-black font-semibold py-3 rounded-lg mt-4">Continue to Payment</button>
      </form>
    </motion.div>
  );

  const renderPaymentForm = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <h2 className="text-2xl font-semibold mb-6">Payment Method</h2>
      {/* Payment options */}
      <div className="flex gap-4 mb-6">
        <div onClick={() => setPaymentMethod('credit-card')} className={`flex-1 flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer ${paymentMethod === 'credit-card' ? 'border-primary bg-yellow-50' : 'border-medium-gray'}`}>
          <FaCreditCard /> <span>Credit Card</span>
        </div>
        <div onClick={() => setPaymentMethod('paypal')} className={`flex-1 flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer ${paymentMethod === 'paypal' ? 'border-primary bg-yellow-50' : 'border-medium-gray'}`}>
          <FaPaypal /> <span>PayPal</span>
        </div>
      </div>
      {paymentMethod === 'credit-card' && (
        <form onSubmit={handlePaymentSubmit} className="space-y-6">
          {/* Credit card fields */}
          <button type="submit" disabled={isProcessing} className="w-full bg-primary text-black font-semibold py-3 rounded-lg mt-4">{isProcessing ? 'Processing...' : 'Complete Payment'}</button>
          <button type="button" onClick={() => setStep(1)} className="w-full bg-transparent text-dark-gray font-medium py-3 mt-2">Back to Shipping</button>
        </form>
      )}
    </motion.div>
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-8">
          {/* Steps */}
          {step === 1 && renderShippingForm()}
          {step === 2 && renderPaymentForm()}
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 self-start sticky top-8">
          <h3 className="text-xl font-semibold mb-6 pb-4 border-b border-light-gray">Order Summary</h3>
          {/* Order summary */}
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
