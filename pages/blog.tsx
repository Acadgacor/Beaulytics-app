import { Layout } from '../src/components/layout/Layout';

const Blog = () => {
  return (
    <Layout>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto my-8 min-h-[60vh]">
        <h1 className="text-3xl font-bold text-center text-primary mb-6">Blog</h1>
        <p className="text-lg leading-relaxed text-dark-gray text-justify">
          Welcome to our blog! Here you'll find articles, tips, and news related to our products and industry. Stay updated with the latest trends and insights.
        </p>
      </div>
    </Layout>
  );
};

export default Blog;
