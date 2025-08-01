import { Layout } from '../src/components/layout/Layout';

const FAQ = () => {
  const faqs = [
    {
      question: 'What is your return policy?',
      answer: 'Our return policy allows you to return products within 30 days of purchase. Please visit our Shipping & Returns page for more details.',
    },
    {
      question: 'How can I track my order?',
      answer: 'You can track your order using the tracking link provided in your shipping confirmation email or by visiting the Track Order page on our website.',
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Currently, we only ship within the United States. We are working on expanding our shipping options in the future.',
    },
    {
      question: 'How can I contact customer support?',
      answer: 'You can contact our customer support team through the Contact Us page, or by emailing us at support@example.com.',
    },
  ];

  return (
    <Layout>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto my-8 min-h-[60vh]">
        <h1 className="text-3xl font-bold text-center text-primary mb-6">Frequently Asked Questions</h1>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index}>
              <h3 className="text-xl font-semibold text-secondary mb-2">{faq.question}</h3>
              <p className="text-lg leading-relaxed text-dark-gray text-justify">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default FAQ;
