import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaPinterest, FaYoutube } from 'react-icons/fa';
import Image from 'next/image';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <FaFacebook />, href: 'https://facebook.com' },
    { icon: <FaTwitter />, href: 'https://twitter.com' },
    { icon: <FaInstagram />, href: 'https://instagram.com' },
    { icon: <FaPinterest />, href: 'https://pinterest.com' },
    { icon: <FaYoutube />, href: 'https://youtube.com' },
  ];

  const shopLinks = [
    { name: 'Cleansers', href: '/products?category=cleanser' },
    { name: 'Serums', href: '/products?category=serum' },
    { name: 'Moisturizers', href: '/products?category=moisturizer' },
    { name: 'Sunscreens', href: '/products?category=sunscreen' },
    { name: 'Masks', href: '/products?category=mask' },
  ];

  const aboutLinks = [
    { name: 'Our Story', href: '/our-story' },
    { name: 'Ingredients', href: '/ingredients' },
    { name: 'Sustainability', href: '/sustainability' },
    { name: 'Blog', href: '/blog' },
    { name: 'Press', href: '/press' },
  ];

  const helpLinks = [
    { name: 'FAQ', href: '/faq' },
    { name: 'Shipping & Returns', href: '/shipping-returns' },
    { name: 'Contact Us', href: '/contact-us' },
    { name: 'Track Order', href: '/track-order' },
    { name: 'Privacy Policy', href: '/privacy-policy' },
  ];

  return (
    <footer className="bg-light-gray pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-8">
          <div className="flex-1 min-w-[250px]">
            <h2 className="text-2xl font-bold mb-4 relative inline-block">
              Beaulytics
              <span className="absolute bottom-0 left-0 w-3/4 h-1 bg-primary" />
            </h2>
            <p className="text-dark-gray leading-relaxed mb-6">
              Your destination for premium skincare products that are scientifically formulated to give you the best results for your skin type and concerns.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-black text-xl transition-all duration-300 ease-in-out hover:bg-primary hover:-translate-y-1"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="flex-2 flex flex-wrap justify-between gap-8 sm:flex-nowrap">
            <div className="min-w-[150px]">
              <h3 className="text-lg font-semibold mb-4">Shop</h3>
              <ul>
                {shopLinks.map((link) => (
                  <li key={link.name} className="mb-2">
                    <Link href={link.href}>
                      <a className="text-dark-gray hover:text-primary transition-colors">{link.name}</a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="min-w-[150px]">
              <h3 className="text-lg font-semibold mb-4">About</h3>
              <ul>
                {aboutLinks.map((link) => (
                  <li key={link.name} className="mb-2">
                    <Link href={link.href}>
                      <a className="text-dark-gray hover:text-primary transition-colors">{link.name}</a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="min-w-[150px]">
              <h3 className="text-lg font-semibold mb-4">Help</h3>
              <ul>
                {helpLinks.map((link) => (
                  <li key={link.name} className="mb-2">
                    <Link href={link.href}>
                      <a className="text-dark-gray hover:text-primary transition-colors">{link.name}</a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-6 mt-12 flex justify-between items-center border-t border-medium-gray flex-col sm:flex-row gap-4 text-center">
          <p className="text-dark-gray text-sm">&copy; {currentYear} Beaulytics. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-sm text-dark-gray">Payment Methods:</span>
            <Image src="/images/payment-methods.png" alt="Payment methods" width={150} height={24} />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
