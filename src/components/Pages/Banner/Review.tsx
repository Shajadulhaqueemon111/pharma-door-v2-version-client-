import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
const reviews = [
  {
    name: "Dr. Mahmud Hasan",
    rating: 5,
    comment: "Very fast delivery and authentic medicines. Highly recommend!",
  },
  {
    name: "Farhana Akter",
    rating: 4,
    comment: "Customer service was helpful and delivery was quick.",
  },
  {
    name: "Tanvir Hossain",
    rating: 5,
    comment: "Excellent app for emergency medicine needs!",
  },
  {
    name: "Rumana Sultana",
    rating: 5,
    comment: "Safe packaging and affordable prices.",
  },
];

const Review = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1 className="text-center text-3xl font-bold text-blue-700">
        Customer Review
      </h1>
      <div className="bg-white py-10 px-5 max-w-7xl mx-auto rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-6">
          What Our Customers Say
        </h2>

        <motion.div
          key={current}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-lg italic mb-4 text-gray-700">
            "{reviews[current].comment}"
          </p>
          <div className="flex justify-center gap-1 mb-2">
            {Array.from({ length: reviews[current].rating }).map((_, i) => (
              <Star
                key={i}
                className="w-5 h-5 text-yellow-400 fill-yellow-400"
              />
            ))}
          </div>
          <p className="text-sm font-medium text-gray-800">
            — {reviews[current].name}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Review;
