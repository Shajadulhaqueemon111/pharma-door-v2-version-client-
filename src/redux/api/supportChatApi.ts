/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiSlice } from './apiSlice';

export const supportChatApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Pharmacist gets their private conversation
    getMySupportChat: builder.query<any, void>({
      query: () => '/support-chat/my-chat',
      providesTags: ['SupportChat'],
    }),

    // Send a message (Pharmacist or Admin)
    sendSupportMessage: builder.mutation<
      any,
      { pharmacistId?: string; message?: string; text?: string }
    >({
      query: (body) => ({
        url: '/support-chat/send',
        method: 'POST',
        body: {
          pharmacistId: body.pharmacistId,
          message: body.message || body.text,
        },
      }),
      invalidatesTags: ['SupportChat'],
    }),

    // Admin views all pharmacist conversations
    getAdminSupportConversations: builder.query<any, void>({
      query: () => '/support-chat/admin/conversations',
      providesTags: ['SupportChat'],
    }),

    // Admin views specific pharmacist's thread
    getAdminChatWithPharmacist: builder.query<any, string>({
      query: (pharmacistId) => `/support-chat/admin/conversations/${pharmacistId}`,
      providesTags: (_result, _error, id) => [{ type: 'SupportChat', id }],
    }),
  }),
});

export const {
  useGetMySupportChatQuery,
  useSendSupportMessageMutation,
  useGetAdminSupportConversationsQuery,
  useGetAdminChatWithPharmacistQuery,
} = supportChatApi;
