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
  twoFactorEnabled?: boolean;
  exp?: number;
}

interface AuthContextType {
  user: DecodedToken | null;
  accessToken: string | null;
  login: (token: string, refreshToken?: string, userData?: Partial<DecodedToken>) => void;
  logout: () => void;
  loading: boolean;
  updateUser: (user: Partial<DecodedToken>, newToken?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Handle existing token or refresh if missing/expired
  useEffect(() => {
    const existingToken = localStorage.getItem("accessToken");
    const savedUserStr = localStorage.getItem("user");
    let cachedUser: DecodedToken | null = null;
    if (savedUserStr) {
      try {
        cachedUser = JSON.parse(savedUserStr);
      } catch {
        cachedUser = null;
      }
    }

    const handleAuth = async () => {
      if (existingToken) {
        try {
          const decoded = jwtDecode<DecodedToken>(existingToken);
          const isExpired = decoded.exp && Date.now() >= decoded.exp * 1000;

          if (isExpired) {
            await refreshToken();
          } else {
            const initialUser = cachedUser ? { ...decoded, ...cachedUser } : decoded;
            setUser(initialUser);
            setAccessToken(existingToken);
            store.dispatch(
              setCredentials({
                user: initialUser,
                accessToken: existingToken,
                refreshToken: localStorage.getItem("refreshToken") || undefined,
              })
            );

            // Fetch latest real-time user profile from backend (profileImage, 2FA status, etc.)
            try {
              const res = await axios.get(`${API_BASE_URL}/api/v1/auth/me`, {
                headers: { Authorization: `Bearer ${existingToken}` },
              });
              if (res.data?.data) {
                const freshUser: DecodedToken = {
                  _id: res.data.data._id,
                  name: res.data.data.name,
                  email: res.data.data.email,
                  role: res.data.data.role,
                  profileImage: res.data.data.profileImage,
                  status: res.data.data.status,
                  twoFactorEnabled: Boolean(res.data.data.twoFactorEnabled),
                };
                setUser(freshUser);
                localStorage.setItem("user", JSON.stringify(freshUser));
                localStorage.setItem("pharmadoor_user", JSON.stringify(freshUser));
                store.dispatch(
                  setCredentials({
                    user: freshUser,
                    accessToken: existingToken,
                    refreshToken: localStorage.getItem("refreshToken") || undefined,
                  })
                );
              }
            } catch (meErr) {
              console.warn("Could not fetch fresh user profile from backend:", meErr);
            }
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

  const login = (token: string, refreshTokenVal?: string, userData?: Partial<DecodedToken>) => {
    localStorage.setItem("accessToken", token);
    if (refreshTokenVal) {
      localStorage.setItem("refreshToken", refreshTokenVal);
    }
    const decoded = jwtDecode<DecodedToken>(token);
    const fullUser: DecodedToken = {
      ...decoded,
      ...(userData || {}),
      profileImage: userData?.profileImage || decoded.profileImage,
      twoFactorEnabled: userData?.twoFactorEnabled !== undefined ? userData.twoFactorEnabled : decoded.twoFactorEnabled,
    };
    setUser(fullUser);
    setAccessToken(token);
    localStorage.setItem("user", JSON.stringify(fullUser));
    localStorage.setItem("pharmadoor_user", JSON.stringify(fullUser));

    store.dispatch(
      setCredentials({
        user: fullUser,
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
      localStorage.removeItem("user");
      localStorage.removeItem("pharmadoor_user");
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
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      store.dispatch(reduxLogout());
    }
  };

  const updateUser = (updatedUser: Partial<DecodedToken>, newToken?: string) => {
    setUser((prev) => {
      const nextUser = { ...(prev || {}), ...updatedUser } as DecodedToken;
      localStorage.setItem("user", JSON.stringify(nextUser));
      localStorage.setItem("pharmadoor_user", JSON.stringify(nextUser));
      return nextUser;
    });

    if (newToken) {
      localStorage.setItem("accessToken", newToken);
      setAccessToken(newToken);
    }

    const tokenToUse = newToken || accessToken || localStorage.getItem("accessToken");
    if (tokenToUse) {
      const nextUser = { ...(user || {}), ...updatedUser } as DecodedToken;
      store.dispatch(
        setCredentials({
          user: nextUser,
          accessToken: tokenToUse,
          refreshToken: localStorage.getItem("refreshToken") || undefined,
        })
      );
    }
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
