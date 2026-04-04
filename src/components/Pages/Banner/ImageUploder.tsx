import image1 from "../../../assets/Image (2).png";
import productImage from "../../../assets/product.png";
import callImage from "../../../assets/download.png";
import { Link } from "react-router-dom";

const ImageUploder = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="flex flex-col sm:flex-row items-center bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition duration-300">
          <div className="flex-1 text-center sm:text-left">
            <p className="text-lg font-semibold text-gray-700">
              Upload Prescription
            </p>
            <Link to="/upload-prescription">
              <button className="mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md">
                Upload
              </button>
            </Link>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-4">
            <img src={image1} alt="Upload" className="h-24 object-contain" />
          </div>
        </div>

        {/* Healthcare Product */}
        <div className="flex flex-col sm:flex-row items-center bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition duration-300">
          <div className="flex-1 text-center sm:text-left">
            <p className="text-lg font-semibold text-gray-700">
              Healthcare Products
            </p>
            <Link to="products/all-products">
              <button className="mt-3 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md">
                Order Now
              </button>
            </Link>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-4">
            <img
              src={productImage}
              alt="Product"
              className="h-24 object-contain"
            />
          </div>
        </div>

        {/* Help Line */}
        <div className="flex flex-col sm:flex-row items-center bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition duration-300">
          <div className="flex-1 text-center sm:text-left">
            <p className="text-lg font-semibold text-gray-700">Help Line</p>
            <Link to="/contact-page">
              <button className="mt-3 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md">
                Call Now
              </button>
            </Link>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-4">
            <img src={callImage} alt="Call" className="h-24 object-contain" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploder;
