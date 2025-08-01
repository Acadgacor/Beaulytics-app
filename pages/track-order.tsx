import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { Layout } from '../src/components/layout/Layout';

interface OrderDetails {
  id: string;
  status: string;
  estimatedDelivery: string;
  currentLocation: string;
}

const TrackOrderPage = () => {
  const [orderId, setOrderId] = useState('');
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrackOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!orderId.trim()) {
      setError('Please enter an order ID.');
      setOrderDetails(null);
      return;
    }
    setLoading(true);
    setError('');
    setOrderDetails(null);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    if (orderId === '12345') {
      setOrderDetails({
        id: '12345',
        status: 'Shipped',
        estimatedDelivery: 'October 25, 2023',
        currentLocation: 'In transit to local facility',
      });
    } else {
      setError('Order not found. Please check the ID and try again.');
    }
    setLoading(false);
  };

  return (
    <Layout>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto my-8 min-h-[60vh] flex flex-col items-center">
        <h1 className="text-3xl font-bold text-center text-primary mb-6">Track Your Order</h1>
        <form onSubmit={handleTrackOrder} className="flex gap-4 mb-8 w-full max-w-lg">
          <input
            type="text"
            placeholder="Enter your order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="flex-grow p-3 border border-medium-gray rounded-lg text-base"
          />
          <button type="submit" disabled={loading} className="bg-primary text-black font-semibold py-3 px-6 rounded-lg flex items-center gap-2">
            {loading ? 'Tracking...' : 'Track'} <FaSearch />
          </button>
        </form>
        {error && <p className="text-error mb-4">{error}</p>}
        {orderDetails && (
          <div className="w-full max-w-lg p-6 border border-light-gray rounded-lg bg-gray-50">
            <h3 className="text-xl font-semibold text-secondary mb-4">Order Status for #{orderDetails.id}</h3>
            <div className="space-y-2">
              <p><strong>Status:</strong> {orderDetails.status}</p>
              <p><strong>Estimated Delivery:</strong> {orderDetails.estimatedDelivery}</p>
              <p><strong>Current Location:</strong> {orderDetails.currentLocation}</p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TrackOrderPage;
