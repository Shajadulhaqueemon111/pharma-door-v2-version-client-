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
    <div className=" min-h-screen bg-white text-black  dark:text-white">
      <FirstNavbar searchText={searchText} setSearchText={setSearchText} />
      <Toaster />
      <AddToCart />
      <Outlet context={{ searchText }} />
      <ScrollingBtn />
      <WhatsAppButton />
      <Footer />
    </div>
  );
};

export default MainRoute;
