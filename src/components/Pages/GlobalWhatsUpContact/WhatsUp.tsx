import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = () => {
  const phoneNumber = "8801234567890";

  return (
    <a
      href={`https://wa.me/${phoneNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-emerald-500 hover:bg-emerald-600 text-white p-3 sm:px-4 sm:py-2.5 rounded-full shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 hover:-translate-y-1 flex items-center gap-2 group cursor-pointer border border-emerald-400/40"
      aria-label="Chat on WhatsApp"
      title="Chat with Pharmacist on WhatsApp"
    >
      <FaWhatsapp className="w-5 h-5 text-white" />
      <span className="text-xs font-bold hidden sm:inline">
        Need Help?
      </span>
    </a>
  );
};

export default WhatsAppButton;
