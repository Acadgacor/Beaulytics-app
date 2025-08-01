import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { auth } from '../../lib/firebase';
import {
  onAuthStateChanged,
  signOut,
  updateProfile,
  updatePassword,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  User,
} from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: any;
  isLoading: boolean;
  error: string | null;
  loginWithGoogle: (tokenResponse: any) => Promise<any>;
  logout: () => Promise<void>;
  updateUserProfile: (displayName: string, photoURL: string) => Promise<void>;
  updateUserEmail: (newEmail: string, password: string) => Promise<void>;
  updateUserPassword: (currentPassword: string, newPassword: string) => Promise<void>;
  isAuthenticated: boolean;
  saveUserToFirestore: (currentUser: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  const db = getFirestore();

  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const saveUserToFirestore = async (currentUser: User) => {
    if (!currentUser) return;

    try {
      const userDocRef = doc(db, 'users', currentUser.uid);

      const userData: { [key: string]: any } = {
        lastLogin: new Date(),
      };

      if (currentUser.email) userData.email = currentUser.email;
      if (currentUser.phoneNumber) userData.phoneNumber = currentUser.phoneNumber;
      if (currentUser.displayName) userData.displayName = currentUser.displayName;
      if (currentUser.photoURL) userData.photoURL = currentUser.photoURL;

      await setDoc(userDocRef, userData, { merge: true });
      console.log('Data pengguna berhasil disimpan di Firestore:', currentUser.uid);
    } catch (err) {
      console.error('Error menyimpan data pengguna di Firestore:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        saveUserToFirestore(currentUser);
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async (tokenResponse: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const accessToken = tokenResponse.access_token;
      if (!accessToken) {
        throw new Error('No access token returned from Google auth');
      }
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error('Failed to fetch user info');
      const profile = await res.json();
      const userObj = {
        id: profile.sub,
        email: profile.email,
        name: profile.name,
        picture: profile.picture,
        provider: 'google',
      };
      setUser(userObj);
      return userObj;
    } catch (err: any) {
      setError('Google login failed. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err: any) {
      setError(`Logout failed: ${err.message}`);
      throw err;
    }
  };

  const updateUserProfile = async (displayName: string, photoURL: string) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!auth.currentUser) {
        throw new Error('No authenticated user');
      }

      await updateProfile(auth.currentUser, {
        displayName: displayName || auth.currentUser.displayName,
        photoURL: photoURL || auth.currentUser.photoURL,
      });

      setUser({ ...auth.currentUser });
      setIsLoading(false);
    } catch (err: any) {
      setError(`Failed to update profile: ${err.message}`);
      setIsLoading(false);
      throw err;
    }
  };

  const updateUserEmail = async (newEmail: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!auth.currentUser || !auth.currentUser.email) {
        throw new Error('No authenticated user');
      }

      const credential = EmailAuthProvider.credential(auth.currentUser.email, password);

      await reauthenticateWithCredential(auth.currentUser, credential);
      await updateEmail(auth.currentUser, newEmail);

      setUser({ ...auth.currentUser });
      setIsLoading(false);
    } catch (err: any) {
      setError(`Failed to update email: ${err.message}`);
      setIsLoading(false);
      throw err;
    }
  };

  const updateUserPassword = async (currentPassword: string, newPassword: string) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!auth.currentUser || !auth.currentUser.email) {
        throw new Error('No authenticated user');
      }

      const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);

      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);

      setIsLoading(false);
    } catch (err: any) {
      setError(`Failed to update password: ${err.message}`);
      setIsLoading(false);
      throw err;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    error,
    loginWithGoogle,
    logout,
    updateUserProfile,
    updateUserEmail,
    updateUserPassword,
    isAuthenticated: !!user,
    saveUserToFirestore,
  };

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthContext.Provider value={value}>
        {children}
        {error && (
          <motion.div
            className="auth-error"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              backgroundColor: 'var(--error)',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '4px',
              zIndex: 1000,
              boxShadow: 'var(--shadow-md)',
            }}
          >
            {error}
          </motion.div>
        )}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
};

export default AuthContext;