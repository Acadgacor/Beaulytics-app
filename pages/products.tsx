import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaFilter, FaTimes } from 'react-icons/fa';
import ProductCard from '../src/components/product/ProductCard';
import ProductFilter from '../src/components/product/ProductFilter';
import productsData from '../lib/products.json';
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
  skinType?: string[];
  concerns?: string[];
}

interface Filters {
  categories: string[];
  skinTypes: string[];
  concerns: string[];
  priceRange: { min: number; max: number };
}

const ProductsPage = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [activeFilters, setActiveFilters] = useState<Filters | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    const { category } = router.query;
    setProducts(productsData);

    if (category) {
      const categoryStr = Array.isArray(category) ? category[0] : category;
      const initialFilters = {
        categories: [categoryStr.toLowerCase()],
        skinTypes: [],
        concerns: [],
        priceRange: {
          min: Math.min(...productsData.map((p) => p.price)),
          max: Math.max(...productsData.map((p) => p.price)),
        },
      };
      setActiveFilters(initialFilters);
      handleFilterChange(initialFilters);
    } else {
      setFilteredProducts(productsData);
    }
  }, [router.query]);

  const handleFilterChange = (filters: Filters | null) => {
    setActiveFilters(filters);

    if (!filters) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter((product) => {
      if (filters.categories.length > 0 && !filters.categories.includes(product.category.toLowerCase())) {
        return false;
      }
      if (filters.skinTypes.length > 0 && !filters.skinTypes.some((type) => product.skinType?.includes(type))) {
        return false;
      }
      if (filters.concerns.length > 0 && !filters.concerns.some((concern) => product.concerns?.includes(concern))) {
        return false;
      }
      if (product.price < filters.priceRange.min || product.price > filters.priceRange.max) {
        return false;
      }
      return true;
    });
    setFilteredProducts(filtered);
  };

  const clearFilter = (filterType: keyof Omit<Filters, 'priceRange'>, value: string) => {
    if (!activeFilters) return;
    const newFilters = { ...activeFilters, [filterType]: activeFilters[filterType].filter((item) => item !== value) };
    handleFilterChange(newFilters);
  };

  const clearAllFilters = () => handleFilterChange(null);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">All Products</h1>
          <p className="text-dark-gray">Discover our range of skincare products</p>
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 py-2 px-4 bg-white border border-medium-gray rounded-lg font-medium mt-4 cursor-pointer"
          >
            <FaFilter /> Filters
          </button>
          {activeFilters && (
            <div className="mt-6">
              <p className="font-semibold mb-2">Active Filters:</p>
              <div className="flex flex-wrap gap-2">
                {activeFilters.categories.map((c) => (
                  <div key={c} className="flex items-center gap-2 py-1 px-3 bg-light-gray rounded-full text-sm capitalize">
                    {c}
                    <button onClick={() => clearFilter('categories', c)} className="bg-none border-none flex items-center justify-center cursor-pointer text-xs text-dark-gray hover:text-black">
                      <FaTimes />
                    </button>
                  </div>
                ))}
                <button onClick={clearAllFilters} className="bg-none border border-medium-gray rounded-full py-1 px-3 text-sm cursor-pointer transition-colors hover:bg-light-gray">
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className={`lg:block ${isMobileFilterOpen ? 'block' : 'hidden'}`}>
            <ProductFilter products={products} onFilterChange={handleFilterChange} />
          </div>

          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="text-center p-12 bg-light-gray rounded-lg">
                <h3 className="mb-2 font-semibold">No products found</h3>
                <p className="text-dark-gray mb-6">Try adjusting your filters to find what you're looking for.</p>
                <button onClick={clearAllFilters} className="bg-primary text-black font-semibold py-3 px-6 rounded-lg transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-md">
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductsPage;
