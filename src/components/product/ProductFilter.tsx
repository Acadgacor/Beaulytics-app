import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaFilter, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';

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

interface ProductFilterProps {
  products: Product[];
  onFilterChange: (filters: Filters | null) => void;
}

const ProductFilter = ({ products, onFilterChange }: ProductFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<Omit<Filters, 'priceRange'> & { priceRange: { min: number; max: number }>>({
    categories: [],
    skinTypes: [],
    concerns: [],
    priceRange: { min: 0, max: 100 },
  });
  const [selectedFilters, setSelectedFilters] = useState<Filters>({
    categories: [],
    skinTypes: [],
    concerns: [],
    priceRange: { min: 0, max: 100 },
  });

  useEffect(() => {
    if (!products || products.length === 0) return;

    const categories = new Set<string>();
    const skinTypes = new Set<string>();
    const concerns = new Set<string>();
    let minPrice = Infinity;
    let maxPrice = 0;

    products.forEach((product) => {
      categories.add(product.category);
      product.skinType?.forEach((type) => skinTypes.add(type));
      product.concerns?.forEach((concern) => concerns.add(concern));
      if (product.price < minPrice) minPrice = product.price;
      if (product.price > maxPrice) maxPrice = product.price;
    });

    const priceRange = {
      min: Math.floor(minPrice),
      max: Math.ceil(maxPrice),
    };

    setFilters({
      categories: Array.from(categories).sort(),
      skinTypes: Array.from(skinTypes).sort(),
      concerns: Array.from(concerns).sort(),
      priceRange,
    });

    setSelectedFilters((prev) => ({ ...prev, priceRange }));
  }, [products]);

  const handleFilterChange = (filterType: keyof Omit<Filters, 'priceRange'>, value: string, isChecked: boolean) => {
    setSelectedFilters((prev) => {
      const newValues = isChecked
        ? [...prev[filterType], value]
        : prev[filterType].filter((item) => item !== value);
      return { ...prev, [filterType]: newValues };
    });
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [type]: Number(value),
      },
    }));
  };

  const applyFilters = () => {
    onFilterChange(selectedFilters);
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const resetFilters = () => {
    const newPriceRange = filters.priceRange;
    setSelectedFilters({
      categories: [],
      skinTypes: [],
      concerns: [],
      priceRange: newPriceRange,
    });
    onFilterChange(null);
  };

  return (
    <div className="relative md:min-w-[250px] md:max-w-xs">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden flex items-center justify-between w-full p-3 bg-white border border-medium-gray rounded-lg font-medium mb-4"
      >
        <div className="flex items-center gap-2">
          <FaFilter /> Filters
        </div>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </button>

      <div
        className={`bg-white rounded-lg shadow-sm p-6 md:block ${
          isOpen ? 'block' : 'hidden'
        } md:static absolute top-0 left-0 w-full h-full z-50 overflow-y-auto`}
      >
        <div className="md:hidden flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Filter Products</h3>
          <button onClick={() => setIsOpen(false)} className="bg-none border-none text-xl cursor-pointer text-dark-gray hover:text-black">
            <FaTimes />
          </button>
        </div>

        {Object.keys(filters).map((filterKey) => {
          const key = filterKey as keyof typeof filters;
          if (key === 'priceRange') {
            return (
              <div key={key} className="mb-6 pb-6 border-b border-light-gray last:border-b-0 last:pb-0">
                <h4 className="text-base font-semibold mb-4">Price Range</h4>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label htmlFor="min-price" className="block text-xs mb-1 text-dark-gray">Min (Rp)</label>
                    <input
                      type="number"
                      id="min-price"
                      min={filters.priceRange.min * 15000}
                      max={selectedFilters.priceRange.max * 15000}
                      value={selectedFilters.priceRange.min * 15000}
                      onChange={(e) => handlePriceChange('min', String(Number(e.target.value) / 15000))}
                      className="w-full p-2 border border-medium-gray rounded-md text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                  <span className="font-semibold text-dark-gray">-</span>
                  <div className="flex-1">
                    <label htmlFor="max-price" className="block text-xs mb-1 text-dark-gray">Max (Rp)</label>
                    <input
                      type="number"
                      id="max-price"
                      min={selectedFilters.priceRange.min * 15000}
                      max={filters.priceRange.max * 15000}
                      value={selectedFilters.priceRange.max * 15000}
                      onChange={(e) => handlePriceChange('max', String(Number(e.target.value) / 15000))}
                      className="w-full p-2 border border-medium-gray rounded-md text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            );
          }
          return (
            <div key={key} className="mb-6 pb-6 border-b border-light-gray last:border-b-0 last:pb-0">
              <h4 className="text-base font-semibold mb-4 capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
              <div className="flex flex-col gap-3">
                {(filters[key] as string[]).map((value) => (
                  <div key={value} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`${key}-${value}`}
                      checked={(selectedFilters[key] as string[]).includes(value)}
                      onChange={(e) => handleFilterChange(key as any, value, e.target.checked)}
                      className="mr-2 cursor-pointer accent-primary w-4 h-4"
                    />
                    <label htmlFor={`${key}-${value}`} className="cursor-pointer text-sm select-none capitalize">
                      {value}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <div className="flex gap-4 mt-6">
          <button
            onClick={resetFilters}
            className="flex-1 py-3 px-4 bg-transparent border border-medium-gray rounded-lg font-medium cursor-pointer transition-colors hover:bg-light-gray"
          >
            Reset All
          </button>
          <motion.button
            onClick={applyFilters}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-2 py-3 px-4 bg-primary text-black border-none rounded-lg font-semibold cursor-pointer transition-transform duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-md"
          >
            Apply Filters
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;
