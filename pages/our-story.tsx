import { Layout } from '../src/components/layout/Layout';

const OurStory = () => {
  return (
    <Layout>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto my-8 min-h-[60vh]">
        <h1 className="text-3xl font-bold text-center text-primary mb-6">Our Story</h1>
        <p className="text-lg leading-relaxed text-dark-gray text-justify">
          Welcome to the Our Story page. Here, we share our journey, mission, and the values that drive us. Our commitment is to provide the best products and services to our customers. Learn more about how we started and what we aim to achieve.
        </p>
      </div>
    </Layout>
  );
};

export default OurStory;
