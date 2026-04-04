import { useEffect, useState } from "react";

import { FaArrowUp } from "react-icons/fa"; // npm install react-icons

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

  return (
    <div>
      {showScrollTop && (
        <button
          onClick={handleScrollToTop}
          className="fixed bottom-6 left-6 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300"
        >
          <FaArrowUp />
        </button>
      )}
    </div>
  );
};

export default ScrollingBtn;
