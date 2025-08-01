import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaArrowRight, FaStar } from 'react-icons/fa';
import productsData from '../lib/products.json';
import Image from 'next/image';
import { Layout } from '../src/components/layout/Layout';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  featured: boolean;
  image?: string;
}

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const featured = productsData.filter((product) => product.featured);
    setFeaturedProducts(featured);
  }, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4">
        {/* Hero Section */}
        <section className="flex items-center min-h-[80vh] py-8 md:py-0 md:flex-row flex-col text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 md:pr-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Discover Your Perfect Skincare Routine
            </h1>
            <p className="text-xl text-dark-gray mb-8">
              Science-backed formulations for radiant, healthy skin
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              <Link href="/products" passHref>
                <a className="bg-primary text-black font-semibold py-3 px-6 rounded-full flex items-center transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-md">
                  Shop Now <FaArrowRight className="ml-2" />
                </a>
              </Link>
              <Link href="/compare" passHref>
                <a className="bg-transparent text-black font-semibold py-3 px-6 rounded-full border-2 border-primary transition-all duration-300 ease-in-out hover:bg-primary hover:-translate-y-1 hover:shadow-md">
                  Compare Products
                </a>
              </Link>
            </div>
          </motion.div>
          <div className="flex-1 mt-8 md:mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Image
                src="/images/hero-image.jpg"
                alt="Skincare products"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </motion.div>
          </div>
        </section>

        {/* Featured Products Section */}
        <h2 className="text-3xl font-bold my-12 text-center relative after:content-[''] after:absolute after:-bottom-2.5 after:left-1/2 after:-translate-x-1/2 after:w-12 after:h-1 after:bg-primary">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
          {featuredProducts.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ y: -10, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)' }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg overflow-hidden shadow-sm"
            >
              <div className="h-52 overflow-hidden">
                <Image
                  src={product.image || '/images/products/placeholder.jpg'}
                  alt={product.name}
                  width={300}
                  height={200}
                  className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-105"
                />
              </div>
              <div className="p-6">
                <span className="text-xs font-semibold text-dark-gray uppercase tracking-widest">
                  {product.category}
                </span>
                <h3 className="text-xl font-semibold my-2">{product.name}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <FaStar className="text-yellow-400" />
                  <span className="text-sm text-dark-gray">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
                <div className="text-xl font-bold mb-4">
                  Rp {(product.price * 15000).toLocaleString('id-ID')}
                </div>
                <div className="flex gap-2">
                  <button className="flex-grow bg-primary text-black font-semibold py-2 rounded-md transition-colors duration-300 ease-in-out hover:bg-yellow-400">
                    Add to Cart
                  </button>
                  <button className="flex-1 bg-light-gray text-black font-semibold py-2 rounded-md transition-colors duration-300 ease-in-out hover:bg-medium-gray">
                    Compare
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Compare Tool Promo */}
        <section className="flex items-center bg-black rounded-lg overflow-hidden my-16 md:flex-row flex-col">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 p-12 flex flex-col"
          >
            <h2 className="text-3xl font-bold text-white text-left relative after:content-[''] after:absolute after:-bottom-2.5 after:left-0 after:w-12 after:h-1 after:bg-primary">
              Find Your Perfect Match
            </h2>
            <p className="text-light-gray text-lg my-8 leading-relaxed">
              Compare up to 3 products side by side to find the perfect skincare solution for your needs. Analyze ingredients, benefits, and reviews to make informed decisions.
            </p>
            <Link href="/compare" passHref>
              <a className="bg-primary text-black font-semibold py-3 px-6 rounded-full self-start">
                Try Compare Tool
              </a>
            </Link>
          </motion.div>
          <div className="flex-1 h-96">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full h-full"
            >
              <Image
                src="/images/compare-tool.jpg"
                alt="Product comparison"
                width={600}
                height={400}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </section>

        {/* Categories Section */}
        <h2 className="text-3xl font-bold my-12 text-center relative after:content-[''] after:absolute after:-bottom-2.5 after:left-1/2 after:-translate-x-1/2 after:w-12 after:h-1 after:bg-primary">
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {['cleanser', 'serum', 'moisturizer', 'sunscreen'].map((category) => (
            <motion.div
              key={category}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="relative h-52 rounded-lg overflow-hidden flex flex-col justify-center items-center bg-light-gray p-8 text-center shadow-sm"
            >
              <h3 className="text-2xl font-semibold mb-4 capitalize">{category}</h3>
              <Link href={`/products?category=${category}`} passHref>
                <a className="flex items-center text-black font-semibold transition-colors duration-300 ease-in-out hover:text-primary">
                  Shop Now <FaArrowRight className="ml-2" />
                </a>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Section */}
        <section className="bg-secondary rounded-lg p-12 mb-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Join Our Newsletter</h2>
            <p className="text-lg mb-8">
              Subscribe to get special offers, free giveaways, and skincare tips.
            </p>
            <form className="flex gap-2 sm:flex-row flex-col">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 py-3 px-4 border border-medium-gray rounded-full text-base outline-none focus:border-primary"
              />
              <button className="bg-black text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 ease-in-out hover:bg-dark-gray hover:-translate-y-1">
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Home;
