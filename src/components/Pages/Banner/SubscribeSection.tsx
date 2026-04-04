import { useState } from "react";
import { motion } from "framer-motion";

const SubscribeSection = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-center text-3xl text-blue-700 font-bold mt-4 mb-4">
        Subscribe for Updates & Offers
      </h1>
      <div
        className="relative bg-cover bg-center py-16 px-4 sm:px-6 rounded-2xl"
        style={{
          backgroundImage:
            "url('https://i.ibb.co/wZNFxd79/360-F-577842756-DWi-S65l-NLDG5-DPaozr-Jk3c9-Tgk-GGBw-Cb.jpg')",
        }}
      >
        <div className="bg-white/80 backdrop-blur-sm w-full max-w-2xl mx-auto rounded-2xl shadow-xl p-6 sm:p-8 text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 text-blue-900">
            Subscribe for Updates & Offers
          </h2>
          <p className="text-sm sm:text-base text-gray-700 mb-5">
            Get the latest medicine deals, health tips & more.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="px-4 py-2 rounded-lg border border-gray-300 w-full sm:w-2/3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all text-sm sm:text-base"
            >
              Subscribe
            </button>
          </form>

          {submitted && (
            <motion.p
              className="mt-4 text-green-700 font-medium text-sm sm:text-base"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Thank you for subscribing!
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscribeSection;
