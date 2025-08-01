import { useState, useEffect } from 'react';
import { auth } from '../../../lib/firebase';
import { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, fetchSignInMethodsForEmail, updatePassword, User } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

interface EmailAuthProps {
  onSuccess: (user: User) => void;
  isPasswordReset?: boolean;
}

const EmailAuth = ({ onSuccess, isPasswordReset = false }: EmailAuthProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);

  const db = getFirestore();

  useEffect(() => {
    const checkEmailLink = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let emailFromStorage = localStorage.getItem('emailForSignIn');
        if (!emailFromStorage) {
          emailFromStorage = window.prompt('Please provide your email for confirmation');
        }
        if (emailFromStorage) {
          setLoading(true);
          try {
            const result = await signInWithEmailLink(auth, emailFromStorage, window.location.href);
            localStorage.removeItem('emailForSignIn');
            const user = result.user;
            setUserData(user);

            const userDocRef = doc(db, 'users', user.uid);
            await setDoc(userDocRef, {
              email: user.email,
              createdAt: new Date(),
              lastLogin: new Date(),
            }, { merge: true });

            if (isPasswordReset) {
              setShowPasswordFields(true);
              setMessage('Please create your new password');
            } else if (onSuccess) {
              onSuccess(user);
            }
          } catch (err: any) {
            setError(`Failed to sign in: ${err.message}`);
          } finally {
            setLoading(false);
          }
        }
      }
    };
    checkEmailLink();
  }, [onSuccess, isPasswordReset, db]);

  const sendEmailLinkHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      if (!isPasswordReset) {
        const methods = await fetchSignInMethodsForEmail(auth, email);
        if (methods.length === 0) {
          setMessage('Email not registered. A new account will be created upon verification.');
        }
      }
      const actionCodeSettings = {
        url: window.location.origin + (isPasswordReset ? '/reset-password' : '/login'),
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      localStorage.setItem('emailForSignIn', email);
      setMessage(`A verification link has been sent to ${email}. Please check your inbox or spam folder.`);
    } catch (err: any) {
      setError(`Failed to send link: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const setNewPassword = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No authenticated user found');
      await updatePassword(user, password);
      setUserData(user);

      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        passwordUpdatedAt: new Date(),
        lastLogin: new Date(),
      }, { merge: true });

      setMessage('Password updated successfully');
      if (onSuccess) {
        onSuccess(user);
      }
    } catch (err: any) {
      setError(`Failed to update password: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {userData ? (
        <div>
          <p className="text-success text-sm mt-1">Login successful!</p>
          <p>User ID (UID): {userData.uid}</p>
          <p>Email: {userData.email}</p>
        </div>
      ) : showPasswordFields ? (
        <>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="w-full p-3 border border-medium-gray rounded-lg text-base transition-colors focus:border-primary focus:outline-none"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            className="w-full p-3 border border-medium-gray rounded-lg text-base transition-colors focus:border-primary focus:outline-none"
          />
          <button onClick={setNewPassword} disabled={loading} className="w-full p-3 rounded-lg bg-primary text-white font-semibold transition-colors hover:bg-yellow-400 disabled:bg-light-gray disabled:cursor-not-allowed">
            {loading ? 'Processing...' : 'Save New Password'}
          </button>
        </>
      ) : (
        <>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full p-3 border border-medium-gray rounded-lg text-base transition-colors focus:border-primary focus:outline-none"
          />
          <button onClick={sendEmailLinkHandler} disabled={loading} className="w-full p-3 rounded-lg bg-primary text-white font-semibold transition-colors hover:bg-yellow-400 disabled:bg-light-gray disabled:cursor-not-allowed">
            {loading ? 'Sending...' : isPasswordReset ? 'Send Password Reset Link' : 'Send Verification Link'}
          </button>
        </>
      )}
      {error && <p className="text-error text-sm mt-1">{error}</p>}
      {message && <p className="text-success text-sm mt-1">{message}</p>}
    </div>
  );
};

export default EmailAuth;
