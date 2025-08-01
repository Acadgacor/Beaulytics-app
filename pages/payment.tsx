import { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FaLock, FaCreditCard, FaPaypal, FaCheck } from 'react-icons/fa';
import { useCart } from '../src/context/CartContext';
import { Layout } from '../src/components/layout/Layout';

const PaymentPage = () => {
  const router = useRouter();
  const { cart, getTotalPrice, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '', cardName: '', expiry: '', cvv: '',
  });

  const formatToRupiah = (price: number) => `Rp ${(price * 15000).toLocaleString('id-ID')}`;

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
      clearCart();
      window.scrollTo(0, 0);
    }, 2000);
  };

  if (isComplete) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto my-16 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <div className="w-20 h-20 bg-success text-white rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheck size={40} />
            </div>
            <h2 className="text-3xl font-bold mb-4">Payment Successful!</h2>
            <p className="text-dark-gray mb-8">Thank you for your order. We've sent a confirmation email to your address.</p>
            <div className="font-semibold text-lg bg-light-gray p-4 rounded-lg mb-8">
              Order Number: #{Math.floor(Math.random() * 1000000)}
            </div>
            <button onClick={() => router.push('/')} className="bg-primary text-black font-semibold py-3 px-8 rounded-lg">
              Back to Home
            </button>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">Payment</h1>
          <p className="text-dark-gray">Complete your payment</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-semibold mb-6">Payment Method</h2>
            {/* Payment options */}
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 self-start sticky top-8">
            <h3 className="text-xl font-semibold mb-6 pb-4 border-b border-light-gray">Order Summary</h3>
            {/* Order summary */}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentPage;
