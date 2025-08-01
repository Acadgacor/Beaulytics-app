import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingCart, FaSearch, FaUser, FaBars, FaTimes, FaSignOutAlt, FaShieldAlt } from 'react-icons/fa';
import { MdCompare } from 'react-icons/md';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useCompare } from '../../context/CompareContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const { getTotalItems, toggleCart } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { compareList } = useCompare();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm)}`);
      setIsSearchOpen(false);
      setSearchTerm('');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    setIsMenuOpen(false);
  };

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const isActive = router.pathname === href;
    return (
      <li className={`mx-2 my-2 md:my-0 relative`}>
        <Link href={href}>
          <a
            onClick={() => setIsMenuOpen(false)}
            className={`text-black font-medium py-2 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:transition-transform after:duration-300 ${
              isActive ? 'after:scale-x-100' : 'after:scale-x-0'
            } hover:after:scale-x-100`}
          >
            {children}
          </a>
        </Link>
      </li>
    );
  };

  return (
    <header className="sticky top-0 w-full bg-white shadow-md z-50">
      <div className="flex justify-between items-center px-4 md:px-8 max-w-7xl mx-auto">
        <div className="z-10">
          <Link href="/">
            <a className="text-2xl font-bold text-black relative">
              Beaulytics.
              <span className="absolute bottom-0 left-0 w-full h-1 bg-primary transform scale-x-75 origin-left" />
            </a>
          </Link>
        </div>

        <button className="md:hidden bg-none border-none text-2xl cursor-pointer z-10" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <nav
          className={`flex items-center md:flex-row flex-col md:static fixed top-0 right-0 w-3/4 md:w-auto h-screen md:h-auto bg-white md:bg-transparent pt-20 md:pt-0 transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          } md:translate-x-0 shadow-lg md:shadow-none`}
        >
          <ul className="flex flex-col md:flex-row list-none md:mr-8 w-full md:w-auto">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/products">Products</NavLink>
            <NavLink href="/compare">Compare</NavLink>
          </ul>

          <div className="flex items-center w-full md:w-auto justify-around md:justify-start p-4 md:p-0 mt-4 md:mt-0">
            <button className="bg-none border-none text-xl p-2 cursor-pointer relative text-black hover:text-primary transition-colors" onClick={toggleSearch}>
              <FaSearch />
            </button>
            {isAuthenticated ? (
              <div className="relative group">
                <button className="bg-none border-none text-xl p-2 cursor-pointer relative text-black hover:text-primary transition-colors">
                  <FaUser />
                </button>
                <div className="absolute top-full right-0 w-56 bg-white rounded-md shadow-lg p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transform group-hover:translate-y-0 transition-all duration-300 z-10 mt-2">
                  <div className="flex flex-col mb-2">
                    <strong className="text-sm mb-1">{user?.displayName || user?.email}</strong>
                    <small className="text-dark-gray text-xs">{user?.email}</small>
                  </div>
                  <hr className="border-t border-light-gray my-2" />
                  <Link href="/profile">
                    <a className="flex items-center gap-2 w-full text-left p-2 rounded-md hover:bg-light-gray text-sm">
                      My Profile
                    </a>
                  </Link>
                  <Link href="/security">
                    <a className="flex items-center gap-2 w-full text-left p-2 rounded-md hover:bg-light-gray text-sm">
                      <FaShieldAlt /> Security
                    </a>
                  </Link>
                  <button onClick={handleLogout} className="flex items-center gap-2 w-full text-left p-2 rounded-md hover:bg-light-gray text-sm">
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login">
                <a className="bg-none border-none text-xl p-2 cursor-pointer relative text-black hover:text-primary transition-colors">
                  <FaUser />
                </a>
              </Link>
            )}
            <Link href="/compare">
              <a className="bg-none border-none text-xl p-2 cursor-pointer relative text-black hover:text-primary transition-colors">
                <MdCompare />
                {compareList.length > 0 && (
                  <span className="absolute top-0 right-0 bg-primary text-black text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {compareList.length}
                  </span>
                )}
              </a>
            </Link>
            <button className="bg-none border-none text-xl p-2 cursor-pointer relative text-black hover:text-primary transition-colors" onClick={toggleCart}>
              <FaShoppingCart />
              {getTotalItems() > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-black text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.form
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSearch}
            className="flex items-center p-2 bg-light-gray"
          >
            <input
              placeholder="Search for products..."
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 border-none bg-transparent p-2 text-base outline-none"
            />
            <button type="submit" className="bg-none border-none p-2 cursor-pointer text-black hover:text-primary">
              <FaSearch />
            </button>
            <button type="button" onClick={toggleSearch} className="bg-none border-none p-2 cursor-pointer text-black ml-2 hover:text-primary">
              <FaTimes />
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
