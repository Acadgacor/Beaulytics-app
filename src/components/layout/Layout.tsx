import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import CartSidebar from '../cart/CartSidebar';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="app-container">
      <Header />
      <CartSidebar />
      <main style={{ display: 'flex', flex: 1, width: '100%' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};
