import { apiSlice } from './apiSlice';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User', 'Sessions'],
    }),

    registerUser: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),

    verifyRegistrationOtp: builder.mutation({
      query: ({ email, otp }) => ({
        url: '/auth/verify-registration-otp',
        method: 'POST',
        body: { email, otp },
      }),
      invalidatesTags: ['User', 'Sessions'],
    }),

    resendOtp: builder.mutation({
      query: (email) => ({
        url: '/auth/resend-otp',
        method: 'POST',
        body: { email },
      }),
    }),

    verify2FA: builder.mutation({
      query: ({ email, otp }) => ({
        url: '/auth/verify-2fa',
        method: 'POST',
        body: { email, otp },
      }),
      invalidatesTags: ['User', 'Sessions'],
    }),

    toggle2FA: builder.mutation({
      query: ({ enabled }) => ({
        url: '/auth/toggle-2fa',
        method: 'PATCH',
        body: { enabled },
      }),
      invalidatesTags: ['User', 'Audit'],
    }),

    changePassword: builder.mutation({
      query: ({ oldPassword, newPassword }) => ({
        url: '/auth/change-password',
        method: 'PATCH',
        body: { oldPassword, newPassword },
      }),
      invalidatesTags: ['Audit'],
    }),

    getSessions: builder.query({
      query: () => '/auth/sessions',
      providesTags: ['Sessions'],
    }),

    uploadAvatar: builder.mutation({
      query: (formData: FormData) => ({
        url: '/users/upload-avatar',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['User', 'Audit'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterUserMutation,
  useVerifyRegistrationOtpMutation,
  useResendOtpMutation,
  useVerify2FAMutation,
  useToggle2FAMutation,
  useChangePasswordMutation,
  useGetSessionsQuery,
  useUploadAvatarMutation,
} = authApi;

