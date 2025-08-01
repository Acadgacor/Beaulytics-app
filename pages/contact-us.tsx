import { useState } from 'react';
import { Layout } from '../src/components/layout/Layout';
import { FaPaperPlane } from 'react-icons/fa';

const ContactUs = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here (e.g., send data to a backend)
    setSubmitted(true);
  };

  return (
    <Layout>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto my-8 min-h-[60vh]">
        <h1 className="text-3xl font-bold text-center text-primary mb-6">Contact Us</h1>
        {submitted ? (
          <p className="text-success text-center mt-4 font-semibold">
            Thank you for your message! We'll get back to you soon.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label htmlFor="name" className="font-medium mb-2 text-dark-gray block">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full p-3 border border-medium-gray rounded-lg text-base transition-colors focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="email" className="font-medium mb-2 text-dark-gray block">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full p-3 border border-medium-gray rounded-lg text-base transition-colors focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="subject" className="font-medium mb-2 text-dark-gray block">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                className="w-full p-3 border border-medium-gray rounded-lg text-base transition-colors focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="message" className="font-medium mb-2 text-dark-gray block">Message</label>
              <textarea
                id="message"
                name="message"
                required
                className="w-full p-3 border border-medium-gray rounded-lg text-base min-h-[150px] resize-y transition-colors focus:border-primary focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-primary text-black font-semibold py-3 px-6 rounded-lg border-none cursor-pointer transition-colors flex items-center justify-center gap-2 hover:bg-yellow-400"
            >
              Send Message <FaPaperPlane />
            </button>
          </form>
        )}
      </div>
    </Layout>
  );
};

export default ContactUs;
