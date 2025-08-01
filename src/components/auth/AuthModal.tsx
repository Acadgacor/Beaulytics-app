import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PhoneAuth from './PhoneAuth';
import EmailAuth from './EmailAuth';
import { User } from 'firebase/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'login' | 'register' | 'reset-password';
  onSuccess: (user: User) => void;
}

const AuthModal = ({ isOpen, onClose, mode = 'login', onSuccess }: AuthModalProps) => {
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');

  const getTitle = () => {
    switch (mode) {
      case 'register':
        return 'Create Account';
      case 'reset-password':
        return 'Reset Password';
      default:
        return 'Login to Your Account';
    }
  };

  const handleAuthSuccess = (user: User) => {
    if (onSuccess) {
      onSuccess(user);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl p-8 w-11/12 max-w-lg shadow-xl relative max-h-[90vh] overflow-y-auto"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-primary text-2xl">
          &times;
        </button>
        <h2 className="text-2xl font-bold text-center text-primary mb-6">{getTitle()}</h2>

        {mode !== 'reset-password' && (
          <div className="flex mb-6 border-b border-light-gray">
            <button
              onClick={() => setAuthMethod('phone')}
              className={`flex-1 py-3 font-semibold transition-colors ${
                authMethod === 'phone' ? 'text-primary border-b-2 border-primary' : 'text-dark-gray'
              }`}
            >
              Via Phone
            </button>
            <button
              onClick={() => setAuthMethod('email')}
              className={`flex-1 py-3 font-semibold transition-colors ${
                authMethod === 'email' ? 'text-primary border-b-2 border-primary' : 'text-dark-gray'
              }`}
            >
              Via Email
            </button>
          </div>
        )}

        {mode === 'reset-password' || authMethod === 'email' ? (
          <EmailAuth onSuccess={handleAuthSuccess} isPasswordReset={mode === 'reset-password'} />
        ) : (
          <PhoneAuth onSuccess={handleAuthSuccess} />
        )}
      </motion.div>
    </motion.div>
  );
};

export default AuthModal;
