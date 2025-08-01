import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FaKey, FaShieldAlt, FaBell, FaCheck, FaChevronDown } from 'react-icons/fa';
import { MdDevices } from 'react-icons/md';
import { useAuth } from '../src/context/AuthContext';
import { Layout } from '../src/components/layout/Layout';

const Security = () => {
  const { user, isAuthenticated, updateUserPassword } = useAuth();
  const router = useRouter();
  const [expandedOption, setExpandedOption] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const loginActivities = [
    { id: 1, device: 'Chrome - Windows', ip: '103.xxx.xxx.1', location: 'Jakarta, Indonesia', date: '2024-01-15 14:30:25', status: 'active' },
    { id: 2, device: 'Safari - iPhone', ip: '103.xxx.xxx.1', location: 'Jakarta, Indonesia', date: '2024-01-14 09:15:42', status: 'success' },
    { id: 3, device: 'Chrome - Android', ip: '114.xxx.xxx.5', location: 'Surabaya, Indonesia', date: '2024-01-13 22:45:18', status: 'failed' },
    { id: 4, device: 'Firefox - Windows', ip: '125.xxx.xxx.2', location: 'Bandung, Indonesia', date: '2024-01-12 16:20:33', status: 'success' },
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const toggleOption = (option: string) => {
    setExpandedOption(expandedOption === option ? null : option);
  };

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long');
      return;
    }

    try {
      await updateUserPassword(currentPassword, newPassword);
      setPasswordSuccess('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setPasswordError(`Failed to update password: ${error.message}`);
    }
  };

  const toggleTwoFactor = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-6xl mx-auto p-4 md:p-8 min-h-[80vh]"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-8">Manage your account's security and privacy settings</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 flex flex-col gap-4">
            <div className="bg-light-gray rounded-xl p-6 border border-medium-gray">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-success text-white">
                  <FaCheck size={16} />
                </div>
                <div>
                  <h3 className="font-semibold">Your Account is Secure</h3>
                  <p className="text-sm text-dark-gray">No suspicious activity detected. Keep your account secure by enabling 2FA.</p>
                </div>
              </div>
            </div>

            {/* Security Options */}
            <div className="space-y-4">
              {/* Password Change */}
              <div className="bg-white rounded-xl p-6 border border-medium-gray cursor-pointer transition-shadow hover:shadow-md" onClick={() => toggleOption('password')}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <FaKey className="text-primary text-2xl" />
                    <div>
                      <h3 className="font-semibold">Change Password</h3>
                      <p className="text-sm text-dark-gray">Update your password for better security.</p>
                    </div>
                  </div>
                  <FaChevronDown className={`transition-transform ${expandedOption === 'password' ? 'rotate-180' : ''}`} />
                </div>
                {expandedOption === 'password' && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-4 pt-4 border-t border-light-gray">
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      {/* Form fields */}
                      <input type="password" placeholder="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full p-3 rounded-lg border border-medium-gray text-sm" required />
                      <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full p-3 rounded-lg border border-medium-gray text-sm" required />
                      <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-3 rounded-lg border border-medium-gray text-sm" required />
                      {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                      {passwordSuccess && <p className="text-green-500 text-sm">{passwordSuccess}</p>}
                      <button type="submit" className="bg-success text-white py-2 px-4 rounded-lg font-semibold text-sm">Update Password</button>
                    </form>
                  </motion.div>
                )}
              </div>

              {/* 2FA */}
              <div className="bg-white rounded-xl p-6 border border-medium-gray cursor-pointer transition-shadow hover:shadow-md" onClick={() => toggleOption('2fa')}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <FaShieldAlt className="text-primary text-2xl" />
                    <div>
                      <h3 className="font-semibold">Two-Factor Authentication (2FA)</h3>
                      <p className="text-sm text-dark-gray">Add an extra layer of security.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold ${twoFactorEnabled ? 'text-green-500' : 'text-gray-500'}`}>{twoFactorEnabled ? 'Enabled' : 'Disabled'}</span>
                    <FaChevronDown className={`transition-transform ${expandedOption === '2fa' ? 'rotate-180' : ''}`} />
                  </div>
                </div>
                {expandedOption === '2fa' && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-4 pt-4 border-t border-light-gray">
                    <p className="text-sm mb-4">2FA adds an extra layer of security by requiring a verification code in addition to your password.</p>
                    <button onClick={toggleTwoFactor} className={`py-2 px-4 rounded-lg font-semibold text-sm text-white ${twoFactorEnabled ? 'bg-red-500' : 'bg-green-500'}`}>
                      {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Notifications */}
              <div className="bg-white rounded-xl p-6 border border-medium-gray cursor-pointer transition-shadow hover:shadow-md" onClick={() => toggleOption('notifications')}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <FaBell className="text-primary text-2xl" />
                    <div>
                      <h3 className="font-semibold">Security Notifications</h3>
                      <p className="text-sm text-dark-gray">Manage account activity alerts.</p>
                    </div>
                  </div>
                  <FaChevronDown className={`transition-transform ${expandedOption === 'notifications' ? 'rotate-180' : ''}`} />
                </div>
                {expandedOption === 'notifications' && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-4 pt-4 border-t border-light-gray space-y-4">
                    {/* Notification toggles */}
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-medium-gray">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold text-primary">Recent Login Activity</h2>
                <p className="text-sm text-dark-gray">Monitor sign-in activity on your account.</p>
              </div>
            </div>
            <div className="space-y-4">
              {loginActivities.map(activity => (
                <div key={activity.id} className="flex items-center p-4 rounded-lg bg-light-gray even:bg-white even:border even:border-medium-gray">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-white mr-4">
                    <MdDevices size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{activity.device}</h4>
                    <p className="text-xs text-dark-gray">{activity.ip} - {activity.location}</p>
                    <p className="text-xs text-dark-gray">{activity.date}</p>
                  </div>
                  <div className={`py-1 px-3 rounded-full text-xs font-semibold text-white ${activity.status === 'active' ? 'bg-primary' : activity.status === 'success' ? 'bg-success' : 'bg-error'}`}>
                    {activity.status === 'active' ? 'Active Session' : activity.status === 'success' ? 'Success' : 'Failed'}
                  </div>
                </div>
              ))}
            </div>
            <button className="bg-transparent border-none text-primary font-semibold py-3 px-2 rounded-lg cursor-pointer mt-4 text-center w-full transition-colors hover:bg-light-gray">
              View All Activity
            </button>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Security;
