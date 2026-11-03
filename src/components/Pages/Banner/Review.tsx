import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Star, Quote, CheckCircle, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";

const reviews = [
  {
    name: "Dr. Mahmud Hasan",
    role: "MBBS, FCPS (Medicine) • Verified Doctor",
    rating: 5,
    comment:
      "PharmaDoor is remarkably reliable for sourcing authentic medications. As a physician, I frequently recommend it to patients for fast, cold-chain compliant doorstep delivery.",
  },
  {
    name: "Farhana Akter",
    role: "Dhaka • Regular Customer",
    rating: 5,
    comment:
      "I ordered my father's chronic diabetes and blood pressure medicines. Uploaded the prescription, received pharmacist confirmation within 15 minutes, and got the parcel in 2 hours!",
  },
  {
    name: "Tanvir Hossain",
    role: "Savar • Verified Patient",
    rating: 5,
    comment:
      "Outstanding customer service and genuine drugs. Their special discounts saved me nearly 20% on monthly supplies. The WhatsApp support is very prompt.",
  },
  {
    name: "Rumana Sultana",
    role: "Uttara • Mother of two",
    rating: 5,
    comment:
      "Childcare medications and pediatric syrups arrived neatly packaged with safety seals intact. Best online pharmacy experience in Bangladesh so far.",
  },
];

const Review = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % reviews.length);
  };

  return (
    <section className="py-14 sm:py-20 bg-slate-50/70 border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Header */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200/60 text-xs font-bold mb-3">
          <MessageSquare size={14} className="text-teal-600" />
          <span>Patient & Doctor Testimonials</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Trusted by Thousands Across Bangladesh
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Read real reviews from registered healthcare professionals and valued patients.
        </p>

        {/* Review Carousel Box */}
        <div className="mt-10 relative">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xl shadow-slate-200/50 relative overflow-hidden"
          >
            <Quote className="absolute top-6 left-6 text-teal-100 w-16 h-16 -z-0 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
              {/* Stars */}
              <div className="flex items-center gap-1 mb-5">
                {[...Array(reviews[current].rating)].map((_, i) => (
                  <Star key={i} size={18} className="text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Comment */}
              <p className="text-sm sm:text-lg text-slate-700 italic max-w-2xl leading-relaxed mb-6 font-medium">
                “{reviews[current].comment}”
              </p>

              {/* Author */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-500 text-white font-extrabold text-base flex items-center justify-center shadow-sm mb-2">
                  {reviews[current].name.charAt(0)}
                </div>

                <h4 className="text-base font-bold text-slate-900">
                  {reviews[current].name}
                </h4>

                <p className="text-xs text-teal-700 font-semibold flex items-center gap-1 mt-0.5">
                  <CheckCircle size={12} className="text-emerald-500" />
                  <span>{reviews[current].role}</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Nav buttons */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 transition flex items-center justify-center shadow-xs cursor-pointer"
              aria-label="Previous review"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2 px-2">
              {reviews.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    current === idx ? "w-6 bg-teal-600" : "w-2 bg-slate-300"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 transition flex items-center justify-center shadow-xs cursor-pointer"
              aria-label="Next review"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Review;
