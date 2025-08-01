import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaStar, FaShoppingCart, FaCheck } from 'react-icons/fa';
import { MdCompare } from 'react-icons/md';
import { useCart } from '../../context/CartContext';
import { useCompare } from '../../context/CompareContext';
import Image from 'next/image';

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

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const { addToCompare, isInCompareList } = useCompare();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleAddToCompare = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addToCompare(product);
  };

  const inCompareList = isInCompareList(product.id.toString());

  return (
    <motion.div
      whileHover={{ y: -10, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)' }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white rounded-lg overflow-hidden shadow-sm h-full"
    >
      <Link href={`/products/${product.id}`}>
        <a className="text-inherit no-underline flex flex-col h-full">
          <div className="relative pt-[100%] overflow-hidden">
            <Image
              src={product.image || '/images/products/placeholder.jpg'}
              alt={product.name}
              layout="fill"
              objectFit="cover"
              className="absolute top-0 left-0 w-full h-full transition-transform duration-500 ease-in-out"
            />
            <div
              className={`absolute bottom-0 left-0 right-0 flex flex-col gap-2 p-4 bg-gradient-to-t from-black/70 to-transparent transition-all duration-300 ease-in-out ${
                isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
              }`}
            >
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-none bg-primary text-black font-semibold cursor-pointer transition-transform duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-md"
              >
                <FaShoppingCart /> Add to Cart
              </button>
              <button
                onClick={handleAddToCompare}
                disabled={inCompareList}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-none font-semibold cursor-pointer transition-colors duration-200 ease-in-out disabled:cursor-default disabled:transform-none disabled:shadow-none ${
                  inCompareList
                    ? 'bg-white/30 text-white'
                    : 'bg-white/80 text-black'
                }`}
              >
                {inCompareList ? (
                  <>
                    <FaCheck /> In Compare
                  </>
                ) : (
                  <>
                    <MdCompare /> Compare
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="p-4 flex-1 flex flex-col">
            <p className="text-dark-gray text-xs capitalize mb-2">{product.category}</p>
            <h3 className="text-base font-semibold mb-2 leading-snug">{product.name}</h3>
            <div className="flex items-center gap-2 mb-2 text-sm">
              <FaStar className="text-yellow-400" />
              <span className="text-dark-gray">{product.rating} ({product.reviews} reviews)</span>
            </div>
            <p className="font-semibold text-base mt-auto text-black">
              Rp {(product.price * 15000).toLocaleString('id-ID')}
            </p>
          </div>
        </a>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
