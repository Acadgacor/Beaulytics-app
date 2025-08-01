import { useState, useEffect } from 'react';
import { useAuth } from '../src/context/AuthContext';
import { useRouter } from 'next/router';
import { User, Camera, Edit3, Shield, Bell, Check, LogOut, X, Package, Heart, Star, ChevronRight } from 'lucide-react';
import { Layout } from '../src/components/layout/Layout';
import Image from 'next/image';

const EcommerceProfile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const [userData, setUserData] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    phone: '0812-3456-7890',
    address: 'Jl. Sudirman No. 123, Jakarta Selatan',
    bio: 'Fashion enthusiast dan beauty lover. Suka belanja produk skincare dan fashion terkini.',
    birthDate: '1995-08-15',
    gender: 'Perempuan',
    profileImage: user?.photoURL || null,
  });

  useEffect(() => {
    if (user) {
      setUserData((prev) => ({
        ...prev,
        name: user.displayName || prev.name,
        email: user.email || prev.email,
        profileImage: user.photoURL || prev.profileImage,
      }));
    }
  }, [user]);

  const [editData, setEditData] = useState(userData);

  const getInitials = (name: string) => {
    return name.split(' ').map((part) => part[0]).join('').toUpperCase();
  };

  const handleSave = () => {
    setUserData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setEditData({ ...editData, profileImage: e.target?.result as string });
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  const recentOrders = [
    { id: '001', status: 'Shipped', total: 'Rp 450.000', date: '20 Jul 2025', items: 3 },
    { id: '002', status: 'Completed', total: 'Rp 280.000', date: '15 Jul 2025', items: 2 },
    { id: '003', status: 'Canceled', total: 'Rp 150.000', date: '10 Jul 2025', items: 1 },
  ];

  const wishlistItems = [
    { id: 1, name: 'Premium Vitamin C Serum', price: 'Rp 250.000', rating: 4.8, image: '/images/products/placeholder.jpg' },
    { id: 2, name: 'Anti-Aging Moisturizer', price: 'Rp 180.000', rating: 4.6, image: '/images/products/placeholder.jpg' },
    { id: 3, name: 'Sunscreen SPF 50+', price: 'Rp 120.000', rating: 4.9, image: '/images/products/placeholder.jpg' },
  ];

  const renderTabContent = () => {
    // Tab rendering logic here
    return <div>Select a tab</div>;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto p-4 md:p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-80">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold shadow-lg'
                          : 'text-gray-600 hover:bg-yellow-50 hover:text-yellow-700'
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  ))}
                  <div className="pt-4 mt-4 border-t border-gray-200">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all">
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </nav>
              </div>
            </div>
            <div className="flex-1">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EcommerceProfile;
