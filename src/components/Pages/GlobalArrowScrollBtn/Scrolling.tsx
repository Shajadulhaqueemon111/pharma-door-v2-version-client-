import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

const ScrollingBtn = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!showScrollTop) return null;

  return (
    <button
      onClick={handleScrollToTop}
      className="fixed bottom-6 left-6 z-40 bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-700 p-3 rounded-full shadow-lg border border-slate-200/80 hover:border-teal-300 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex items-center justify-center group"
      aria-label="Scroll to top"
      title="Back to Top"
    >
      <ArrowUp size={18} className="group-hover:-translate-y-0.5 transition-transform" />
    </button>
  );
};

export default ScrollingBtn;
