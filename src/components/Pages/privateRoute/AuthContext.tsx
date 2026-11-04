/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { API_BASE_URL } from "../../../config/api";
import { store } from "../../../redux/store";
import { setCredentials, logout as reduxLogout } from "../../../redux/features/auth/authSlice";

export interface DecodedToken {
  _id: string;
  name: string;
  role: string;
  email: string;
  profileImage: string;
  status?: string;
  exp?: number;
}

interface AuthContextType {
  user: DecodedToken | null;
  accessToken: string | null;
  login: (token: string, refreshToken?: string) => void;
  logout: () => void;
  loading: boolean;
  updateUser: (user: DecodedToken) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Handle existing token or refresh if missing/expired
  useEffect(() => {
    const existingToken = localStorage.getItem("accessToken");

    const handleAuth = async () => {
      if (existingToken) {
        try {
          const decoded = jwtDecode<DecodedToken>(existingToken);
          const isExpired = decoded.exp && Date.now() >= decoded.exp * 1000;

          if (isExpired) {
            await refreshToken();
          } else {
            setUser(decoded);
            setAccessToken(existingToken);
            store.dispatch(
              setCredentials({
                user: decoded,
                accessToken: existingToken,
                refreshToken: localStorage.getItem("refreshToken") || undefined,
              })
            );
          }
        } catch {
          await refreshToken();
        }
      } else {
        await refreshToken();
      }

      setLoading(false);
    };

    handleAuth();
  }, []);

  const login = (token: string, refreshTokenVal?: string) => {
    localStorage.setItem("accessToken", token);
    if (refreshTokenVal) {
      localStorage.setItem("refreshToken", refreshTokenVal);
    }
    const decoded = jwtDecode<DecodedToken>(token);
    setUser(decoded);
    setAccessToken(token);

    store.dispatch(
      setCredentials({
        user: decoded,
        accessToken: token,
        refreshToken: refreshTokenVal || localStorage.getItem("refreshToken") || undefined,
      })
    );
  };

  const logout = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/v1/auth/logout`,
        {},
        { withCredentials: true },
      );
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      store.dispatch(reduxLogout());
    }
  };

  const refreshToken = async () => {
    try {
      const storedRefresh = localStorage.getItem("refreshToken");
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/auth/refresh-token`,
        { refreshToken: storedRefresh },
        { withCredentials: true },
      );
      const newToken = res.data?.data?.accessToken || res.data?.accessToken;
      if (newToken) {
        login(newToken, storedRefresh || undefined);
      }
    } catch (err) {
      console.error("Refresh token failed:", err);
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      store.dispatch(reduxLogout());
    }
  };

  const updateUser = (updatedUser: DecodedToken) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{ user, accessToken, login, logout, loading, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
