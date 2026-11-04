import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../../config/api';
import { setAccessToken, logout } from '../features/auth/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: `${API_BASE_URL}/api/v1`,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as any;
    const token = state.auth?.token || localStorage.getItem('accessToken');

    if (token) {
      // Ensure Bearer prefix format
      const clean = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      headers.set('Authorization', clean);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken =
      (api.getState() as any).auth?.refreshToken ||
      localStorage.getItem('refreshToken');

    if (refreshToken) {
      // Attempt refresh token
      const refreshResult = await baseQuery(
        {
          url: '/auth/refresh-token',
          method: 'POST',
          body: { refreshToken },
        },
        api,
        extraOptions,
      );

      if (refreshResult.data) {
        const newAccessToken =
          (refreshResult.data as any)?.data?.accessToken ||
          (refreshResult.data as any)?.accessToken;

        if (newAccessToken) {
          api.dispatch(setAccessToken(newAccessToken));
          // Retry initial request with new access token
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logout());
        }
      } else {
        api.dispatch(logout());
      }
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Medicine', 'Order', 'Equipment', 'Offer', 'Notification', 'Audit', 'Sessions'],
  endpoints: () => ({}),
});
