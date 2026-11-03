import { Outlet } from "react-router-dom";
import FirstNavbar from "../Pages/Navbar/FirstNavbar";
import Footer from "../Pages/Footer/Footer";
import ScrollingBtn from "../Pages/GlobalArrowScrollBtn/Scrolling";
import WhatsAppButton from "../Pages/GlobalWhatsUpContact/WhatsUp";
import { Toaster } from "react-hot-toast";
import { useState } from "react";
import AddToCart from "../Pages/AddToCart/CartBtn";

const MainRoute = () => {
  const [searchText, setSearchText] = useState("");

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased font-sans">
      <FirstNavbar searchText={searchText} setSearchText={setSearchText} />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#0f172a",
            color: "#fff",
            fontSize: "13px",
            borderRadius: "12px",
            padding: "12px 16px",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
        }}
      />
      <AddToCart />
      <main className="flex-1">
        <Outlet context={{ searchText }} />
      </main>
      <ScrollingBtn />
      <WhatsAppButton />
      <Footer />
    </div>
  );
};

export default MainRoute;
