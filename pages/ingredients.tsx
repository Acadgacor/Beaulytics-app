import { Layout } from '../src/components/layout/Layout';

const Ingredients = () => {
  return (
    <Layout>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto my-8 min-h-[60vh]">
        <h1 className="text-3xl font-bold text-center text-primary mb-6">Ingredients</h1>
        <p className="text-lg leading-relaxed text-dark-gray text-justify">
          Discover the quality ingredients that go into our products. We believe in transparency and are committed to using only the best components. Each ingredient is carefully selected to ensure safety and efficacy.
        </p>
      </div>
    </Layout>
  );
};

export default Ingredients;
