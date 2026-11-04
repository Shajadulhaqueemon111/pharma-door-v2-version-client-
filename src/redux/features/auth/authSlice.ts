import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  profileImage?: string;
  status?: string;
  twoFactorEnabled?: boolean;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  twoFactorPendingEmail: string | null;
  lockoutUntil: number | null; // timestamp ms
}

const getStoredToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
};

const getStoredRefreshToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refreshToken');
};

const getStoredUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('pharmadoor_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  user: getStoredUser(),
  token: getStoredToken(),
  refreshToken: getStoredRefreshToken(),
  isAuthenticated: Boolean(getStoredToken()),
  twoFactorPendingEmail: null,
  lockoutUntil: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: AuthUser;
        accessToken: string;
        refreshToken?: string;
      }>,
    ) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.token = accessToken;
      state.isAuthenticated = true;
      state.twoFactorPendingEmail = null;
      state.lockoutUntil = null;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('pharmadoor_user', JSON.stringify(user));

      if (refreshToken) {
        state.refreshToken = refreshToken;
        localStorage.setItem('refreshToken', refreshToken);
      }
    },

    setAccessToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('accessToken', action.payload);
    },

    setTwoFactorPending: (
      state,
      action: PayloadAction<{ email: string }>,
    ) => {
      state.twoFactorPendingEmail = action.payload.email;
    },

    setLockoutPenalty: (state, action: PayloadAction<number>) => {
      state.lockoutUntil = action.payload;
    },

    updateUserProfile: (state, action: PayloadAction<Partial<AuthUser>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('pharmadoor_user', JSON.stringify(state.user));
      }
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.twoFactorPendingEmail = null;

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('pharmadoor_user');
      localStorage.removeItem('token');
    },
  },
});

export const {
  setCredentials,
  setAccessToken,
  setTwoFactorPending,
  setLockoutPenalty,
  updateUserProfile,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
