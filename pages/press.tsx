import { Layout } from '../src/components/layout/Layout';

const Press = () => {
  return (
    <Layout>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto my-8 min-h-[60vh]">
        <h1 className="text-3xl font-bold text-center text-primary mb-6">Press</h1>
        <p className="text-lg leading-relaxed text-dark-gray text-justify">
          Find our latest press releases, media mentions, and news updates here. We are excited to share our story and achievements with the public.
        </p>
      </div>
    </Layout>
  );
};

export default Press;
