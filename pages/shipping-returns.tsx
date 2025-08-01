import { Layout } from '../src/components/layout/Layout';

const ShippingReturns = () => {
  return (
    <Layout>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto my-8 min-h-[60vh]">
        <h1 className="text-3xl font-bold text-center text-primary mb-6">Shipping & Returns</h1>
        <div>
          <h2 className="text-2xl font-semibold text-secondary mt-8 mb-4">Shipping Policy</h2>
          <p className="text-lg leading-relaxed text-dark-gray text-justify mb-4">
            We offer standard shipping on all orders. Orders are typically processed within 1-2 business days. Shipping times vary depending on your location, but most orders arrive within 5-7 business days. You will receive a shipping confirmation email with a tracking number once your order has shipped.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-secondary mt-8 mb-4">Return Policy</h2>
          <p className="text-lg leading-relaxed text-dark-gray text-justify mb-4">
            We want you to be completely satisfied with your purchase. If you are not happy with your order, you can return it within 30 days of receipt for a full refund or exchange. Products must be returned in their original condition and packaging. To initiate a return, please contact our customer service team through the Contact Us page.
          </p>
          <p className="text-lg leading-relaxed text-dark-gray text-justify">
            Please note that some items, such as sale items or personalized products, may not be eligible for return. Check the product description for specific return information.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default ShippingReturns;
