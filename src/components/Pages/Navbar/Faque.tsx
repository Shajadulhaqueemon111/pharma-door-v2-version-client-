import { useState } from "react";

const faqs = [
  {
    question: "How do I place an order?",
    answer:
      "You can place an order by searching your medicine, adding it to cart, and checking out through our secure payment gateway.",
  },
  {
    question: "Do you deliver all over Bangladesh?",
    answer:
      "Yes, we deliver medicines to every corner of Bangladesh through our verified logistics partners.",
  },
  {
    question: "Are your medicines genuine?",
    answer:
      "Absolutely. We only sell medicines from verified pharmacies and certified distributors.",
  },
  {
    question: "Can I track my order?",
    answer:
      "Yes, you’ll receive a tracking link after your order is confirmed and shipped.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-gray-100 px-4 py-16 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-10">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left px-6 py-4 font-semibold text-lg text-primary focus:outline-none flex justify-between items-center"
              >
                {faq.question}
                <span>{openIndex === index ? "−" : "+"}</span>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-gray-600 text-sm">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
