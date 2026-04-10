import { createBrowserRouter } from "react-router-dom";
import MainRoute from "./MainRoute";
import ErrorPage from "../Pages/Error/Error";
import HomePage from "../Pages/Home/Home";
import NapaMedicines from "../Pages/Medicines/Napa";
import SecloMedicines from "../Pages/Medicines/Seclo";

import StethoscopePage from "../Pages/Equipments/Stethoscope";
import ThermomiterPage from "../Pages/Equipments/Thermomiter";
import OnlineDoctors from "../Pages/OnlineDoctor/OnlineDoctors";
import NapaDetailsPage from "../Pages/Medicines/NapaDetailsPage";
import SeclodetailsPage from "../Pages/Medicines/SeclodetailsPage";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import OtciMedicineDetails from "../Pages/OtcMedicine/OticiMedicineDetails";
import AllMedicineDetails from "../Pages/OtcMedicine/AllMedicineDetails";
import AllProducts from "../Pages/Products/AllProducts";
import AllProductDetails from "../Pages/Products/AllProductDetails";
import StethoscopeDetails from "../Pages/Equipments/StethoscopeDetails";
import ThermomiterDetails from "../Pages/Equipments/ThermomiterDetails";
// import ProtectedRoute from "../ProtectedRoute";
import AdminMainLayout from "../Pages/dashboard/AdminMainLayout";
import AdminDashboard from "../Pages/dashboard/AdminDashboard";
import ProductPage from "../Pages/dashboard/ProductPage";
import Createproduct from "../Pages/dashboard/Createproduct";
import AdminProtectedRoute from "../Pages/dashboard/AdminProtectedRoute";
import PhermacistRegister from "../Pages/Register/PhermacistRegister";
import PharmasistMainLayout from "../Pages/pharmasistDashboard/PharmasistMainLayout";
import PharmacistProtectedRoute from "../Pages/pharmasistDashboard/PharmacistProtectedRoute";
import PharmasistsDashboard from "../Pages/pharmasistDashboard/PharmasistsDashboard";
import AllUsers from "../Pages/dashboard/AllUsers";
import AllRegisterPhaemacist from "../Pages/dashboard/AllRegisterPhaemacist";
import PharmacistDocument from "../Pages/dashboard/PharmacistDocument";
import UpdateAllUser from "../Pages/dashboard/UpdateAllUser";
import UpdatePharmacist from "../Pages/dashboard/UpdatePharmacist";
import PharmacistProfile from "../Pages/pharmasistDashboard/PharmacistProfile";
import CreateMedicine from "../Pages/pharmasistDashboard/CreateMedicine";
import AllMedicinePage from "../Pages/pharmasistDashboard/AllMedicinePage";
import ExpireAllMedicine from "../Pages/pharmasistDashboard/ExpireAllMedicine";
import UpdateExpireMedicines from "../Pages/pharmasistDashboard/UpdateExpireMedicines";
import UpdateMedicine from "../Pages/pharmasistDashboard/UpdateMedicine";
import ContactPage from "../Pages/contactPage/ContactPage";
// import AddToCard from "../Pages/AddToCart/AddToCard";
import Checkout from "../Pages/AddToCart/CheckOut";
import OrderedMedicine from "../Pages/pharmasistDashboard/OrderedMedicine";
import Invoice from "../Pages/pharmasistDashboard/Invoice";
import CreateEquipments from "../Pages/pharmasistDashboard/CreateEquipments";

import AllEquipmentPage from "../Pages/pharmasistDashboard/AllEquipmentPage";
import UpdateEquemment from "../Pages/pharmasistDashboard/UpdateEquemment";
import ProtectedRoute from "../ProtectedRoute";
import PreExpiryNotification from "../Pages/pharmasistDashboard/PreExpiryNotification";
import UpdatePreExpireMedicines from "../Pages/pharmasistDashboard/UpdatePreExpireMedicine";
import PrescriptionUpload from "../Pages/Banner/PrescriptionUpload";
import PrescribeMedicineDetails from "../Pages/Banner/PrescribeMedicineDetails";
import OrderStatusUpdate from "../Pages/pharmasistDashboard/OrderStatusUpdate";
import AboutePage from "../Pages/Navbar/Aboute";
import BlogDetailsPage from "../Pages/BlogSection/BlogDetailsPage";
import SpecialOfferDetails from "../Pages/OfferSection/SpecialOfferDetails";
import UserProfile from "../Pages/Navbar/UserProfile";
import OtcMedicineDetailsPerCard from "../Pages/OtcMedicine/OtcMedicineDetailsPerCard";
import CreateOfferProduct from "../Pages/pharmasistDashboard/CreateOfferProduct/CreateOfferProduct";
import AllOfferProducts from "../Pages/pharmasistDashboard/CreateOfferProduct/AllOfferProducts";
import UpdateOfferPage from "../Pages/pharmasistDashboard/CreateOfferProduct/UpdateOfferPage";
import BlogPostForm from "../Pages/pharmasistDashboard/Blog/CreateBlog";
import AnimalMedicineDetails from "../Pages/AnimalMedicine/AnimalDetails";
import AllAnimalMedicinePage from "../Pages/pharmasistDashboard/AnimalMedicine/AllAnimalMedicine";
import CreateAnimalMedicine from "../Pages/pharmasistDashboard/AnimalMedicine/CreateAnimalMedicine";
import UpdateAnimalMedicine from "../Pages/pharmasistDashboard/AnimalMedicine/UpdateAnimalMedicine";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainRoute />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/medicines/napa",
        element: (
          // <ProtectedRoute>
          <NapaMedicines />
          // </ProtectedRoute>
        ),
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/upload-prescription",
        element: <PrescriptionUpload />,
      },
      {
        path: "/prescription-medicine-details/:_id",
        element: <PrescribeMedicineDetails />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/profile",
        element: <UserProfile />,
      },
      {
        path: "/phermacist-register",
        element: <PhermacistRegister />,
      },
      {
        path: "/contact-page",
        element: <ContactPage />,
      },
      {
        path: "/medicine-details/:_id",
        element: <OtcMedicineDetailsPerCard />,
      },
      {
        path: "/blog/:_id",
        element: <BlogDetailsPage />,
      },
      {
        path: "/medicines/napaDetails/:_id",
        element: <NapaDetailsPage />,
      },
      {
        path: "/medicines/seclo",
        element: <SecloMedicines />,
      },
      {
        path: "/medicines/secloDetails/:_id",
        element: <SeclodetailsPage />,
      },
      {
        path: "/medicines/specialoffer/:_id",
        element: <SpecialOfferDetails />,
      },

      {
        path: "/medicines/aboute",
        element: <AboutePage />,
      },
      {
        path: "/medicines/checkout",
        element: (
          <ProtectedRoute>
            {" "}
            <Checkout />
          </ProtectedRoute>
        ),
      },

      {
        path: "/products/all-products",
        element: <AllProducts />,
      },
      {
        path: "/products/:_id",
        element: <AllProductDetails />,
      },
      {
        path: "/animal-medicine/:_id",
        element: <AnimalMedicineDetails />,
      },
      {
        path: "/equipments/stethoscope",
        element: <StethoscopePage />,
      },
      {
        path: "/equipments/:_id",
        element: <StethoscopeDetails />,
      },
      {
        path: "/equipments/thermometer",
        element: (
          <ProtectedRoute>
            {" "}
            <ThermomiterPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/equipments/:_id",
        element: <ThermomiterDetails />,
      },
      {
        path: "/online-doctor",
        element: <OnlineDoctors />,
      },
      {
        path: "/otc-medicine-details",
        element: <OtciMedicineDetails />,
      },
      {
        path: "allmedicineDetails/:_id",
        element: <AllMedicineDetails />,
      },
    ],
  },
  {
    path: "/admin-dashboard",
    element: (
      <AdminProtectedRoute>
        {" "}
        <AdminMainLayout />
      </AdminProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <AdminDashboard />,
      },
      {
        path: "all-users",
        element: <AllUsers />,
      },
      {
        path: "all-pharmacist",
        element: <AllRegisterPhaemacist />,
      },
      {
        path: "all-document",
        element: <PharmacistDocument />,
      },
      {
        path: "all-users/:_id/edit",
        element: <UpdateAllUser />,
      },
      {
        path: "all-pharmacist/:_id",
        element: <UpdatePharmacist />,
      },
      {
        path: "products",
        element: <ProductPage />,
      },
      {
        path: "create-product",
        element: <Createproduct />,
      },
    ],
  },
  {
    path: "/pharmacist-dashboard",
    element: (
      <PharmacistProtectedRoute>
        <PharmasistMainLayout />
      </PharmacistProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <PharmasistsDashboard />,
      },
      {
        path: "all-medicine",
        element: <AllMedicinePage />,
      },
      {
        path: "update-specific-medicine/:_id",
        element: <UpdateMedicine />,
      },

      {
        path: "create-medicine",
        element: <CreateMedicine />,
      },
      {
        path: "orderd-medicine",
        element: <OrderedMedicine />,
      },
      {
        path: "update-orderd-status/:_id",
        element: <OrderStatusUpdate />,
      },
      {
        path: "invoice-medicine/:_id",
        element: <Invoice />,
      },
      {
        path: "profile",
        element: <PharmacistProfile />,
      },
      {
        path: "expire-medicines",
        element: <ExpireAllMedicine />,
      },
      {
        path: "update-expire-medicines/:_id",
        element: <UpdateExpireMedicines />,
      },
      {
        path: "create-equipment",
        element: <CreateEquipments />,
      },
      {
        path: "all-equipment",
        element: <AllEquipmentPage />,
      },
      {
        path: "update-equipment/:_id",
        element: <UpdateEquemment />,
      },
      {
        path: "pre-expire-medicine",
        element: <PreExpiryNotification />,
      },
      {
        path: "update-pre-expire-medicine/:_id",
        element: <UpdatePreExpireMedicines />,
      },
      {
        path: "create-offer-medicine",
        element: <CreateOfferProduct />,
      },
      {
        path: "all-offer-medicine",
        element: <AllOfferProducts />,
      },
      {
        path: "update-offer-page/:_id",
        element: <UpdateOfferPage />,
      },
      {
        path: "create-blog",
        element: <BlogPostForm />,
      },
      {
        path: "All-animal-medicine",
        element: <AllAnimalMedicinePage />,
      },
      {
        path: "create-animal-medicine",
        element: <CreateAnimalMedicine />,
      },
      {
        path: "update-animal-medicine/:_id",
        element: <UpdateAnimalMedicine />,
      },
    ],
  },
]);

export default router;
