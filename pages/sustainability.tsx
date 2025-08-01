import { Layout } from '../src/components/layout/Layout';

const Sustainability = () => {
  return (
    <Layout>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto my-8 min-h-[60vh]">
        <h1 className="text-3xl font-bold text-center text-primary mb-6">Sustainability</h1>
        <p className="text-lg leading-relaxed text-dark-gray text-justify">
          Learn about our commitment to sustainability. We strive to make a positive impact on the environment and our community through responsible practices. Our efforts include ethical sourcing, eco-friendly packaging, and reducing our carbon footprint.
        </p>
      </div>
    </Layout>
  );
};

export default Sustainability;
