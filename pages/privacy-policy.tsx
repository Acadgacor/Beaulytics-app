import { Layout } from '../src/components/layout/Layout';

const PrivacyPolicy = () => {
  return (
    <Layout>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto my-8 min-h-[60vh]">
        <h1 className="text-3xl font-bold text-center text-primary mb-6">Privacy Policy</h1>
        <div>
          <h2 className="text-2xl font-semibold text-secondary mt-8 mb-4">Introduction</h2>
          <p className="text-lg leading-relaxed text-dark-gray text-justify mb-4">
            Your privacy is important to us. This privacy policy explains how we collect, use, disclose, and safeguard your information when you visit our website. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-secondary mt-8 mb-4">Information We Collect</h2>
          <p className="text-lg leading-relaxed text-dark-gray text-justify mb-4">
            We may collect information about you in a variety of ways. The information we may collect on the Site includes personal data, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site, such as online chat and message boards.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-secondary mt-8 mb-4">Use of Your Information</h2>
          <div className="text-lg leading-relaxed text-dark-gray text-justify mb-4">
            We use information collected about you via the Site to:
            <ul className="list-disc list-inside mt-2">
              <li>Deliver targeted advertising, coupons, newsletters, and other information regarding promotions and the Site to you.</li>
              <li>Email you regarding your account or order.</li>
              <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Site.</li>
            </ul>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-secondary mt-8 mb-4">Security of Your Information</h2>
          <p className="text-lg leading-relaxed text-dark-gray text-justify mb-4">
            We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-secondary mt-8 mb-4">Contact Us</h2>
          <p className="text-lg leading-relaxed text-dark-gray text-justify">
            If you have questions or comments about this Privacy Policy, please contact us at support@beaulytis.com.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
