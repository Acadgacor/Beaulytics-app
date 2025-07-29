import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { FaTimes, FaPlus, FaArrowLeft } from 'react-icons/fa';

// Import sample product data
import productsData from '../data/products.json';

// Import context
import { useCompare } from '../context/CompareContext';

// Import components
import CompareItem from '../components/compare/CompareItem';

const Compare = () => {
  // Use compare context
  const { compareList, addToCompare, removeFromCompare, clearCompareList, isInCompareList, maxCompareItems } = useCompare();
  
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Load all products for filtering
  useEffect(() => {
    setFilteredProducts(productsData);
  }, []);
  
  // Handle search input change
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim() === '') {
      setFilteredProducts(productsData);
    } else {
      const filtered = productsData.filter(product => 
        product.name.toLowerCase().includes(term.toLowerCase()) ||
        product.category.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };
  
  // Handle adding product to compare list
  const handleAddToCompare = (product) => {
    addToCompare(product);
    setShowProductSelector(false);
  };
  
  // Get all unique ingredients from products in compare list
  const getAllIngredients = () => {
    const allIngredients = new Set();
    compareList.forEach(product => {
      product.ingredients.forEach(ingredient => {
        allIngredients.add(ingredient);
      });
    });
    return Array.from(allIngredients).sort();
  };
  
  // Get all unique skin types from products in compare list
  const getAllSkinTypes = () => {
    const allSkinTypes = new Set();
    compareList.forEach(product => {
      product.skinType.forEach(type => {
        allSkinTypes.add(type);
      });
    });
    return Array.from(allSkinTypes).sort();
  };
  
  // Get all unique concerns from products in compare list
  const getAllConcerns = () => {
    const allConcerns = new Set();
    compareList.forEach(product => {
      product.concerns.forEach(concern => {
        allConcerns.add(concern);
      });
    });
    return Array.from(allConcerns).sort();
  };
  
  return (
    <CompareContainer>
      <CompareHeader>
        <h1>Compare Products</h1>
        <p>Compare up to 3 products side by side to find your perfect match</p>
      </CompareHeader>
      
      <CompareGrid>
        {/* Product slots */}
        {compareList.map((product, index) => (
          <CompareItem 
            key={product.id}
            product={product}
            onRemove={removeFromCompare}
          />
        ))}
        
        {/* Empty slots */}
        {Array.from({ length: maxCompareItems - compareList.length }).map((_, index) => (
          <EmptySlot 
            key={`empty-${index}`}
            onClick={() => setShowProductSelector(true)}
            as={motion.div}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
          >
            <FaPlus />
            <p>Add Product</p>
          </EmptySlot>
        ))}
      </CompareGrid>
      
      {compareList.length > 0 && (
        <CompareDetails>
          <CompareSection>
            <SectionTitle>Basic Information</SectionTitle>
            <CompareRow>
              <RowLabel>Category</RowLabel>
              {compareList.map(product => (
                <RowValue key={`category-${product.id}`}>
                  {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                </RowValue>
              ))}
              {Array.from({ length: 3 - compareList.length }).map((_, index) => (
                <RowValue key={`empty-category-${index}`}>-</RowValue>
              ))}
            </CompareRow>
            
            <CompareRow>
              <RowLabel>Size</RowLabel>
              {compareList.map(product => (
                <RowValue key={`size-${product.id}`}>{product.size}</RowValue>
              ))}
              {Array.from({ length: 3 - compareList.length }).map((_, index) => (
                <RowValue key={`empty-size-${index}`}>-</RowValue>
              ))}
            </CompareRow>
            
            <CompareRow>
              <RowLabel>Price</RowLabel>
              {compareList.map(product => (
                <RowValue key={`price-${product.id}`} highlight>
                  Rp {(product.price * 15000).toLocaleString('id-ID')}
                </RowValue>
              ))}
              {Array.from({ length: 3 - compareList.length }).map((_, index) => (
                <RowValue key={`empty-price-${index}`}>-</RowValue>
              ))}
            </CompareRow>
          </CompareSection>
          
          <CompareSection>
            <SectionTitle>Skin Type Compatibility</SectionTitle>
            {getAllSkinTypes().map(skinType => (
              <CompareRow key={`skintype-${skinType}`}>
                <RowLabel>{skinType.charAt(0).toUpperCase() + skinType.slice(1)}</RowLabel>
                {compareList.map(product => (
                  <RowValue key={`skintype-${product.id}-${skinType}`}>
                    {product.skinType.includes(skinType) ? 
                      <CompatibilityDot compatible /> : 
                      <CompatibilityDot />}
                  </RowValue>
                ))}
                {Array.from({ length: 3 - compareList.length }).map((_, index) => (
                  <RowValue key={`empty-skintype-${index}-${skinType}`}>-</RowValue>
                ))}
              </CompareRow>
            ))}
          </CompareSection>
          
          <CompareSection>
            <SectionTitle>Concerns Addressed</SectionTitle>
            {getAllConcerns().map(concern => (
              <CompareRow key={`concern-${concern}`}>
                <RowLabel>{concern.charAt(0).toUpperCase() + concern.slice(1)}</RowLabel>
                {compareList.map(product => (
                  <RowValue key={`concern-${product.id}-${concern}`}>
                    {product.concerns.includes(concern) ? 
                      <CompatibilityDot compatible /> : 
                      <CompatibilityDot />}
                  </RowValue>
                ))}
                {Array.from({ length: 3 - compareList.length }).map((_, index) => (
                  <RowValue key={`empty-concern-${index}-${concern}`}>-</RowValue>
                ))}
              </CompareRow>
            ))}
          </CompareSection>
          
          <CompareSection>
            <SectionTitle>Key Ingredients</SectionTitle>
            {getAllIngredients().map(ingredient => (
              <CompareRow key={`ingredient-${ingredient}`}>
                <RowLabel>{ingredient}</RowLabel>
                {compareList.map(product => (
                  <RowValue key={`ingredient-${product.id}-${ingredient}`}>
                    {product.ingredients.includes(ingredient) ? 
                      <CompatibilityDot compatible /> : 
                      <CompatibilityDot />}
                  </RowValue>
                ))}
                {Array.from({ length: 3 - compareList.length }).map((_, index) => (
                  <RowValue key={`empty-ingredient-${index}-${ingredient}`}>-</RowValue>
                ))}
              </CompareRow>
            ))}
          </CompareSection>
          
          <CompareSection>
            <SectionTitle>How To Use</SectionTitle>
            {compareList.map(product => (
              <HowToUseCard key={`howtouse-${product.id}`}>
                <h4>{product.name}</h4>
                <p>{product.howToUse}</p>
              </HowToUseCard>
            ))}
          </CompareSection>
        </CompareDetails>
      )}
      
      {compareList.length === 0 && (
        <EmptyCompareMessage>
          <h2>No Products to Compare</h2>
          <p>Add products to start comparing their features, ingredients, and benefits.</p>
          <PrimaryButton onClick={() => setShowProductSelector(true)}>
            Add Products
          </PrimaryButton>
        </EmptyCompareMessage>
      )}
      
      {/* Product Selector Modal */}
      <AnimatePresence>
        {showProductSelector && (
          <Modal
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ModalContent
              as={motion.div}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ModalHeader>
                <h3>Select a Product to Compare</h3>
                <CloseButton onClick={() => setShowProductSelector(false)}>
                  <FaTimes />
                </CloseButton>
              </ModalHeader>
              
              <SearchContainer>
                <SearchInput 
                  type="text" 
                  placeholder="Search products..." 
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </SearchContainer>
              
              <ProductList>
                {filteredProducts
                  .filter(product => !isInCompareList(product.id))
                  .map(product => (
                    <ProductListItem 
                      key={product.id}
                      onClick={() => handleAddToCompare(product)}
                      as={motion.div}
                      whileHover={{ backgroundColor: 'var(--light-gray)' }}
                    >
                      <ProductListImage src={product.image || `/images/products/placeholder.jpg`} alt={product.name} />
                      <ProductListInfo>
                        <h4>{product.name}</h4>
                        <p>{product.category} • Rp {(product.price * 15000).toLocaleString('id-ID')}</p>
                      </ProductListInfo>
                    </ProductListItem>
                  ))}
              </ProductList>
              
              <ModalFooter>
                <SecondaryButton onClick={() => setShowProductSelector(false)}>
                  Cancel
                </SecondaryButton>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
      
      <BackToShop as={Link} to="/products">
        <FaArrowLeft /> Back to Shopping
      </BackToShop>
    </CompareContainer>
  );
};

// Styled Components
const CompareContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const CompareHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: var(--dark-gray);
  }
`;

const CompareGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const ProductCard = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1rem;
  color: var(--dark-gray);
  cursor: pointer;
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--error);
  }
`;

const ProductImage = styled.img`
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 1rem;
`;

const ProductName = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const ProductCategory = styled.p`
  color: var(--dark-gray);
  font-size: 0.9rem;
  text-transform: capitalize;
  margin-bottom: 0.5rem;
`;

const ProductPrice = styled.p`
  font-weight: 700;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: var(--black);
`;

const ProductRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RatingValue = styled.span`
  font-weight: 700;
  background-color: var(--primary);
  color: var(--black);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
`;

const RatingCount = styled.span`
  color: var(--dark-gray);
  font-size: 0.9rem;
`;

const EmptySlot = styled.div`
  background-color: var(--light-gray);
  border: 2px dashed var(--medium-gray);
  border-radius: 10px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  height: 100%;
  min-height: 300px;
  transition: all 0.3s ease;
  
  svg {
    font-size: 2rem;
    color: var(--dark-gray);
    margin-bottom: 1rem;
  }
  
  p {
    color: var(--dark-gray);
    font-weight: 500;
  }
  
  &:hover {
    border-color: var(--primary);
    background-color: rgba(255, 235, 59, 0.1);
    
    svg, p {
      color: var(--black);
    }
  }
`;

const CompareDetails = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: var(--shadow-sm);
  margin-bottom: 2rem;
`;

const CompareSection = styled.div`
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--light-gray);
`;

const CompareRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--light-gray);
  align-items: center;
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1.5fr 1fr 1fr 1fr;
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
    text-align: center;
    padding: 1rem 0;
  }
`;

const RowLabel = styled.div`
  font-weight: 500;
  
  @media (max-width: 576px) {
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
`;

const RowValue = styled.div`
  text-align: center;
  font-weight: ${props => props.highlight ? '700' : '400'};
  color: ${props => props.highlight ? 'var(--black)' : 'var(--dark-gray)'};
`;

const CompatibilityDot = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${props => props.compatible ? 'var(--success)' : 'var(--medium-gray)'};
  margin: 0 auto;
`;

const HowToUseCard = styled.div`
  background-color: var(--light-gray);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  
  h4 {
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  p {
    font-size: 0.9rem;
    line-height: 1.5;
  }
`;

const EmptyCompareMessage = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background-color: white;
  border-radius: 10px;
  box-shadow: var(--shadow-sm);
  
  h2 {
    margin-bottom: 1rem;
  }
  
  p {
    color: var(--dark-gray);
    margin-bottom: 2rem;
  }
`;

const PrimaryButton = styled.button`
  background-color: var(--primary);
  color: var(--black);
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
  }
`;

const SecondaryButton = styled.button`
  background-color: var(--light-gray);
  color: var(--black);
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--medium-gray);
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 10px;
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--light-gray);
  
  h3 {
    font-weight: 600;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--dark-gray);
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--black);
  }
`;

const SearchContainer = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--light-gray);
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--medium-gray);
  border-radius: 50px;
  font-size: 1rem;
  outline: none;
  
  &:focus {
    border-color: var(--primary);
  }
`;

const ProductList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem 1.5rem;
`;

const ProductListItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:not(:last-child) {
    margin-bottom: 0.5rem;
  }
`;

const ProductListImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 1rem;
`;

const ProductListInfo = styled.div`
  h4 {
    font-weight: 500;
    margin-bottom: 0.25rem;
  }
  
  p {
    font-size: 0.9rem;
    color: var(--dark-gray);
  }
`;

const ModalFooter = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--light-gray);
  display: flex;
  justify-content: flex-end;
`;

const BackToShop = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--black);
  font-weight: 500;
  margin-top: 1rem;
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--primary);
  }
`;

export default Compare;