import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaArrowLeft, FaStar, FaCheck } from 'react-icons/fa';
import { MdCompare } from 'react-icons/md';

// Import contexts
import { useCart } from '../context/CartContext';
import { useCompare } from '../context/CompareContext';

// Import sample product data
import productsData from '../data/products.json';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  
  // Use context hooks
  const { addToCart } = useCart();
  const { addToCompare, isInCompareList } = useCompare();
  
  // Fetch product data
  useEffect(() => {
    // In a real app, this would be an API call
    const foundProduct = productsData.find(p => p.id === parseInt(id));
    setProduct(foundProduct);
    setLoading(false);
  }, [id]);
  
  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <p>Loading product...</p>
      </LoadingContainer>
    );
  }
  
  if (!product) {
    return (
      <ErrorContainer>
        <h2>Product Not Found</h2>
        <p>Sorry, we couldn't find the product you're looking for.</p>
        <BackButton as={Link} to="/products">
          <FaArrowLeft /> Back to Products
        </BackButton>
      </ErrorContainer>
    );
  }
  
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };
  
  const handleAddToCart = () => {
    addToCart(product, quantity);
  };
  
  const handleAddToCompare = () => {
    addToCompare(product);
  };
  
  const inCompareList = isInCompareList(product.id);
  
  return (
    <ProductDetailContainer>
      <BackLink as={Link} to="/products">
        <FaArrowLeft /> Back to Products
      </BackLink>
      
      <ProductContent>
        <ProductImageContainer>
          <ProductImage src={product.image || `/images/products/placeholder.jpg`} alt={product.name} />
        </ProductImageContainer>
        
        <ProductInfo>
          <ProductCategory>{product.category}</ProductCategory>
          <ProductName>{product.name}</ProductName>
          
          <ProductRating>
            <FaStar color="#FFEB3B" />
            <span>{product.rating} ({product.reviews} reviews)</span>
          </ProductRating>
          
          <ProductPrice>Rp {(product.price * 15000).toLocaleString('id-ID')}</ProductPrice>
          
          <ProductDescription>
            {product.description}
          </ProductDescription>
          
          <ProductMeta>
            <MetaItem>
              <MetaLabel>Size:</MetaLabel>
              <MetaValue>{product.size}</MetaValue>
            </MetaItem>
            
            <MetaItem>
              <MetaLabel>Skin Type:</MetaLabel>
              <MetaValue>{product.skinType.join(', ')}</MetaValue>
            </MetaItem>
          </ProductMeta>
          
          <AddToCartSection>
            <QuantityControl>
              <QuantityLabel>Quantity:</QuantityLabel>
              <QuantityWrapper>
                <QuantityButton 
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </QuantityButton>
                <QuantityInput 
                  type="number" 
                  min="1" 
                  value={quantity}
                  onChange={handleQuantityChange}
                />
                <QuantityButton onClick={() => setQuantity(prev => prev + 1)}>
                  +
                </QuantityButton>
              </QuantityWrapper>
            </QuantityControl>
            
            <ActionButtons>
              <AddToCartButton onClick={handleAddToCart}>
                <FaShoppingCart /> Add to Cart
              </AddToCartButton>
              
              <CompareButton 
                onClick={handleAddToCompare}
                isInCompare={inCompareList}
                disabled={inCompareList}
              >
                {inCompareList ? (
                  <>
                    <FaCheck /> In Compare
                  </>
                ) : (
                  <>
                    <MdCompare /> Add to Compare
                  </>
                )}
              </CompareButton>
            </ActionButtons>
          </AddToCartSection>
        </ProductInfo>
      </ProductContent>
      
      <ProductTabs>
        <TabButtons>
          <TabButton 
            isActive={activeTab === 'description'}
            onClick={() => setActiveTab('description')}
          >
            Description
          </TabButton>
          <TabButton 
            isActive={activeTab === 'ingredients'}
            onClick={() => setActiveTab('ingredients')}
          >
            Ingredients
          </TabButton>
          <TabButton 
            isActive={activeTab === 'howToUse'}
            onClick={() => setActiveTab('howToUse')}
          >
            How to Use
          </TabButton>
        </TabButtons>
        
        <TabContent>
          {activeTab === 'description' && (
            <TabPanel>
              <p>{product.description}</p>
              
              <ConcernsSection>
                <h4>Addresses These Concerns:</h4>
                <ConcernsList>
                  {product.concerns.map(concern => (
                    <ConcernTag key={concern}>{concern}</ConcernTag>
                  ))}
                </ConcernsList>
              </ConcernsSection>
            </TabPanel>
          )}
          
          {activeTab === 'ingredients' && (
            <TabPanel>
              <IngredientsList>
                {product.ingredients.map(ingredient => (
                  <IngredientItem key={ingredient}>
                    <FaCheck /> {ingredient}
                  </IngredientItem>
                ))}
              </IngredientsList>
            </TabPanel>
          )}
          
          {activeTab === 'howToUse' && (
            <TabPanel>
              <p>{product.howToUse}</p>
            </TabPanel>
          )}
        </TabContent>
      </ProductTabs>
    </ProductDetailContainer>
  );
};

// Styled Components
const ProductDetailContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--dark-gray);
  margin-bottom: 2rem;
  text-decoration: none;
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--black);
  }
`;

const ProductContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const ProductImageContainer = styled.div`
  border-radius: 10px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProductCategory = styled.p`
  color: var(--dark-gray);
  font-size: 0.9rem;
  text-transform: capitalize;
  margin-bottom: 0.5rem;
`;

const ProductName = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  line-height: 1.2;
`;

const ProductRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  
  span {
    color: var(--dark-gray);
  }
`;

const ProductPrice = styled.p`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
`;

const ProductDescription = styled.p`
  color: var(--dark-gray);
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const ProductMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MetaLabel = styled.span`
  font-weight: 600;
`;

const MetaValue = styled.span`
  color: var(--dark-gray);
  text-transform: capitalize;
`;

const AddToCartSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const QuantityLabel = styled.span`
  font-weight: 600;
`;

const QuantityWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const QuantityButton = styled.button`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--light-gray);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.2rem;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityInput = styled.input`
  width: 50px;
  height: 36px;
  text-align: center;
  border: 1px solid var(--light-gray);
  border-radius: 4px;
  margin: 0 0.5rem;
  font-size: 1rem;
  
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const AddToCartButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  background-color: var(--primary);
  color: var(--black);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
  }
`;

const CompareButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: 1px solid var(--medium-gray);
  background-color: ${props => props.isInCompare ? 'var(--light-gray)' : 'transparent'};
  color: var(--black);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background-color: var(--light-gray);
  }
  
  &:disabled {
    cursor: default;
  }
`;

const ProductTabs = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: var(--shadow-sm);
  overflow: hidden;
`;

const TabButtons = styled.div`
  display: flex;
  border-bottom: 1px solid var(--light-gray);
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const TabButton = styled.button`
  flex: 1;
  padding: 1rem;
  background-color: ${props => props.isActive ? 'white' : 'var(--light-gray)'};
  border: none;
  border-bottom: ${props => props.isActive ? '2px solid var(--primary)' : 'none'};
  font-weight: ${props => props.isActive ? '600' : 'normal'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.isActive ? 'white' : '#f0f0f0'};
  }
`;

const TabContent = styled.div`
  padding: 2rem;
`;

const TabPanel = styled.div`
  line-height: 1.6;
`;

const ConcernsSection = styled.div`
  margin-top: 2rem;
  
  h4 {
    margin-bottom: 1rem;
  }
`;

const ConcernsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const ConcernTag = styled.span`
  background-color: var(--light-gray);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  text-transform: capitalize;
`;

const IngredientsList = styled.ul`
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const IngredientItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: var(--success);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 1rem;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid var(--light-gray);
  border-top: 4px solid var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  max-width: 600px;
  margin: 0 auto;
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  background-color: var(--primary);
  color: var(--black);
  font-weight: 600;
  cursor: pointer;
  margin-top: 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
  }
`;

export default ProductDetail;