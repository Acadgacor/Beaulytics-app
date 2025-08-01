import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaArrowLeft, FaStar, FaCheck } from 'react-icons/fa';
import { MdCompare } from 'react-icons/md';
import { useCart } from '../../src/context/CartContext';
import { useCompare } from '../../src/context/CompareContext';
import productsData from '../../lib/products.json';
import { Layout } from '../../src/components/layout/Layout';
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
  description: string;
  size: string;
  skinType: string[];
  concerns: string[];
  ingredients: string[];
  howToUse: string;
}

const ProductDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const { addToCart } = useCart();
  const { addToCompare, isInCompareList } = useCompare();

  useEffect(() => {
    if (id) {
      const foundProduct = productsData.find((p) => p.id === parseInt(id as string));
      setProduct(foundProduct || null);
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return <Layout><div className="flex flex-col items-center justify-center min-h-screen gap-4"><div className="w-10 h-10 border-4 border-light-gray border-t-primary rounded-full animate-spin" /><p>Loading product...</p></div></Layout>;
  }

  if (!product) {
    return <Layout><div className="text-center p-16 max-w-xl mx-auto"><h2>Product Not Found</h2><p>Sorry, we couldn't find the product you're looking for.</p><Link href="/products"><a className="inline-flex items-center gap-2 py-3 px-6 rounded-lg bg-primary text-black font-semibold mt-6">Back to Products</a></Link></div></Layout>;
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0) setQuantity(value);
  };

  const handleAddToCart = () => addToCart(product, quantity);
  const handleAddToCompare = () => addToCompare(product);
  const inCompareList = isInCompareList(product.id.toString());

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/products">
          <a className="inline-flex items-center gap-2 text-dark-gray mb-8 hover:text-black">
            <FaArrowLeft /> Back to Products
          </a>
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div className="rounded-lg overflow-hidden shadow-sm">
            <Image src={product.image || '/images/products/placeholder.jpg'} alt={product.name} width={600} height={600} layout="responsive" objectFit="cover" />
          </div>
          <div className="flex flex-col">
            <p className="text-sm text-dark-gray capitalize mb-2">{product.category}</p>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4"><FaStar className="text-yellow-400" /><span>{product.rating} ({product.reviews} reviews)</span></div>
            <p className="text-3xl font-bold mb-6">Rp {(product.price * 15000).toLocaleString('id-ID')}</p>
            <p className="text-dark-gray leading-relaxed mb-6">{product.description}</p>
            <div className="flex flex-wrap gap-4 mb-8">
              <div><span className="font-semibold">Size:</span><span className="text-dark-gray capitalize ml-2">{product.size}</span></div>
              <div><span className="font-semibold">Skin Type:</span><span className="text-dark-gray capitalize ml-2">{product.skinType.join(', ')}</span></div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <span className="font-semibold">Quantity:</span>
                <div className="flex items-center">
                  <button onClick={() => setQuantity((p) => Math.max(1, p - 1))} disabled={quantity <= 1} className="w-9 h-9 flex items-center justify-center bg-light-gray rounded-md text-xl disabled:opacity-50">-</button>
                  <input type="number" min="1" value={quantity} onChange={handleQuantityChange} className="w-12 h-9 text-center border-y border-light-gray" />
                  <button onClick={() => setQuantity((p) => p + 1)} className="w-9 h-9 flex items-center justify-center bg-light-gray rounded-md text-xl">+</button>
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={handleAddToCart} className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg bg-primary text-black font-semibold">
                  <FaShoppingCart /> Add to Cart
                </button>
                <button onClick={handleAddToCompare} disabled={inCompareList} className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg border font-semibold ${inCompareList ? 'bg-light-gray border-medium-gray' : 'border-medium-gray'}`}>
                  {inCompareList ? <><FaCheck /> In Compare</> : <><MdCompare /> Add to Compare</>}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex border-b border-light-gray">
            <button onClick={() => setActiveTab('description')} className={`flex-1 p-4 font-semibold ${activeTab === 'description' ? 'border-b-2 border-primary' : ''}`}>Description</button>
            <button onClick={() => setActiveTab('ingredients')} className={`flex-1 p-4 font-semibold ${activeTab === 'ingredients' ? 'border-b-2 border-primary' : ''}`}>Ingredients</button>
            <button onClick={() => setActiveTab('howToUse')} className={`flex-1 p-4 font-semibold ${activeTab === 'howToUse' ? 'border-b-2 border-primary' : ''}`}>How to Use</button>
          </div>
          <div className="p-8">
            {activeTab === 'description' && <div><p>{product.description}</p><div className="mt-8"><h4>Addresses These Concerns:</h4><div className="flex flex-wrap gap-2 mt-4">{product.concerns.map(c => <span key={c} className="bg-light-gray py-1 px-3 rounded-full text-sm capitalize">{c}</span>)}</div></div></div>}
            {activeTab === 'ingredients' && <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">{product.ingredients.map(i => <li key={i} className="flex items-center gap-2"><FaCheck className="text-success" />{i}</li>)}</ul>}
            {activeTab === 'howToUse' && <p>{product.howToUse}</p>}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetailPage;
