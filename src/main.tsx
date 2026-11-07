import "./config/api";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/store";

import { RouterProvider } from "react-router-dom";
import "./index.css";
import router from "./components/route/AllRoute";

import { AuthProvider } from "./components/Pages/privateRoute/AuthContext";
import { CartProvider } from "./components/Pages/AddToCart/CartContext";
import { ThemeProvider } from "./components/Pages/Theme-context/ThemeContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <RouterProvider router={router} />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
