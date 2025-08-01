import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { AuthProvider } from '../src/context/AuthContext';
import { CartProvider } from '../src/context/CartContext';
import { CompareProvider } from '../src/context/CompareContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <CartProvider>
        <CompareProvider>
          <Component {...pageProps} />
        </CompareProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default MyApp;
