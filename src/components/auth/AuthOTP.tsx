import { useAuth } from '../../context/AuthContext';
import AuthButton from './AuthButton';

const AuthOTP = () => {
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 w-full max-w-md mx-auto p-8">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold text-center text-primary mb-6">
        {isAuthenticated ? 'Your Profile' : 'Authentication'}
      </h1>

      {isAuthenticated ? (
        <>
          <div className="bg-light-gray p-6 rounded-lg mb-6">
            <h3 className="text-xl font-bold text-primary mb-2">{user.displayName || 'User'}</h3>
            {user.email && <p className="text-dark-gray mb-2">Email: {user.email}</p>}
            {user.phoneNumber && <p className="text-dark-gray">Phone: {user.phoneNumber}</p>}
          </div>
          <button
            onClick={handleLogout}
            className="py-2 px-4 rounded-lg bg-transparent text-error font-semibold border border-error transition-colors hover:bg-error hover:text-white"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <div className="flex gap-4 mt-4">
            <AuthButton mode="login" primary={true} text="Login" />
            <AuthButton mode="register" primary={false} text="Register" />
          </div>
          <div className="flex items-center my-6">
            <hr className="flex-grow border-t border-light-gray" />
            <span className="px-4 text-sm text-dark-gray">or</span>
            <hr className="flex-grow border-t border-light-gray" />
          </div>
          <AuthButton mode="reset-password" primary={false} text="Forgot Password?" />
        </>
      )}
    </div>
  );
};

export default AuthOTP;
