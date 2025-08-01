import { useState } from 'react';
import { auth } from '../../../lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult, User } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

interface PhoneAuthProps {
  onSuccess: (user: User) => void;
}

const PhoneAuth = ({ onSuccess }: PhoneAuthProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);

  const db = getFirestore();

  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'normal',
        callback: () => {
          setMessage('reCAPTCHA verified');
        },
        'expired-callback': () => {
          setError('reCAPTCHA expired. Please try again.');
        },
      });
    }
  };

  const sendOTP = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Please enter a valid phone number');
      setLoading(false);
      return;
    }

    try {
      setupRecaptcha();
      const formattedPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber : `+62${phoneNumber.startsWith('0') ? phoneNumber.substring(1) : phoneNumber}`;
      const appVerifier = (window as any).recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhoneNumber, appVerifier);
      (window as any).confirmationResult = confirmationResult;
      setVerificationId(confirmationResult.verificationId);
      setMessage('OTP has been sent to your phone number');
    } catch (err: any) {
      console.error('Error sending OTP:', err);
      setError(`Failed to send OTP: ${err.message}`);
      if ((window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier.clear();
        (window as any).recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter the 6-digit OTP');
      setLoading(false);
      return;
    }

    try {
      const confirmationResult = (window as any).confirmationResult as ConfirmationResult;
      const userCredential = await confirmationResult.confirm(verificationCode);
      const user = userCredential.user;
      setUserData(user);

      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        phoneNumber: user.phoneNumber,
        createdAt: new Date(),
        lastLogin: new Date(),
      }, { merge: true });

      setMessage('Verification successful!');
      if (onSuccess) {
        onSuccess(user);
      }
    } catch (err: any) {
      console.error('Error verifying OTP:', err);
      setError(`Verification failed: ${err.message}`);
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
          <p>Phone Number: {userData.phoneNumber}</p>
        </div>
      ) : !verificationId ? (
        <>
          <input
            type="tel"
            placeholder="Phone Number (e.g., 08123456789)"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={loading}
            className="w-full p-3 border border-medium-gray rounded-lg text-base transition-colors focus:border-primary focus:outline-none"
          />
          <div id="recaptcha-container"></div>
          <button onClick={sendOTP} disabled={loading} className="w-full p-3 rounded-lg bg-primary text-white font-semibold transition-colors hover:bg-yellow-400 disabled:bg-light-gray disabled:cursor-not-allowed">
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            maxLength={6}
            disabled={loading}
            className="w-full p-3 border border-medium-gray rounded-lg text-base transition-colors focus:border-primary focus:outline-none"
          />
          <button onClick={verifyOTP} disabled={loading} className="w-full p-3 rounded-lg bg-primary text-white font-semibold transition-colors hover:bg-yellow-400 disabled:bg-light-gray disabled:cursor-not-allowed">
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
          <button onClick={() => setVerificationId('')} className="bg-transparent text-gray-700 border border-gray-300 p-3 rounded-lg w-full hover:bg-gray-100">
            Back
          </button>
        </>
      )}
      {error && <p className="text-error text-sm mt-1">{error}</p>}
      {message && <p className="text-success text-sm mt-1">{message}</p>}
    </div>
  );
};

export default PhoneAuth;
