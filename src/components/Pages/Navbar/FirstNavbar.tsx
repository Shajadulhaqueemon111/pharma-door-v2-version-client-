import image1 from "../../../assets/Image2.png";
import image2 from "../../../assets/Image (1).png";

import SecondNavbar from "./SecondNavbar";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../privateRoute/AuthContext";

import SearchBar from "./SearchBar";
import UserMenu from "./UsreMenu";

type FirstNavbarProps = {
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
};
const FirstNavbar: React.FC<FirstNavbarProps> = ({
  searchText,
  setSearchText,
}) => {
  const { user, logout } = useAuth();
  const nevigate = useNavigate();
  const handlelogout = () => {
    logout();
    nevigate("/login");
  };

  return (
    <div className="shadow-sm w-full sticky top-0 z-50 bg-cyan-200">
      {/* Top Navbar */}
      <div className="flex items-center justify-between flex-wrap px-4 py-3 gap-4">
        {/* Logo (md up) */}
        <Link to="/">
          <div className="hidden md:flex items-center font-bold text-xl md:text-2xl text-[#469498] whitespace-nowrap mr-4">
            PharmaD
            <img src={image1} alt="logo" className="w-5 h-5 mx-1" />
            <img src={image1} alt="logo" className="w-5 h-5 mx-1" />r
          </div>
        </Link>

        {/* SearchBar  */}
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-md">
            <SearchBar searchText={searchText} setSearchText={setSearchText} />
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden md:flex items-center">
            <img src={image2} alt="delivery" className="w-6 h-6 mr-1" />
            <p className="text-sm">Your Order</p>
          </div>

          {user ? (
            user.role === "user" ? (
              <UserMenu user={user} handleLogout={handlelogout} />
            ) : (
              <button
                onClick={handlelogout}
                className="btn btn-error btn-sm text-xs"
              >
                Logout
              </button>
            )
          ) : (
            <Link to="/login">
              <button className="btn btn-success btn-sm text-xs">Login</button>
            </Link>
          )}

          {/* <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center bg-gray-100">
            <FcBusinessman size={18} />
          </div> */}
        </div>
      </div>

      <div>
        <SecondNavbar />
      </div>
    </div>
  );
};

export default FirstNavbar;
