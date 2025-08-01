import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import AuthModal from './AuthModal';
import { User } from 'firebase/auth';

interface AuthButtonProps {
  mode?: 'login' | 'register' | 'reset-password';
  primary?: boolean;
  text?: string;
}

const AuthButton = ({ mode = 'login', primary = true, text }: AuthButtonProps) => {
  const { isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isAuthenticated && mode !== 'reset-password') {
    return null;
  }

  const getButtonText = () => {
    if (text) return text;
    switch (mode) {
      case 'register':
        return 'Daftar';
      case 'reset-password':
        return 'Lupa Password?';
      default:
        return 'Masuk';
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleAuthSuccess = (user: User) => {
    console.log('Autentikasi berhasil:', user);
  };

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 ${
          primary
            ? 'bg-yellow-400 text-white border-none hover:bg-yellow-300'
            : 'bg-transparent text-yellow-400 border border-yellow-400 hover:bg-yellow-50'
        }`}
      >
        {getButtonText()}
      </button>

      <AuthModal
        isOpen={isModalOpen}
        onClose={closeModal}
        mode={mode}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
};

export default AuthButton;
