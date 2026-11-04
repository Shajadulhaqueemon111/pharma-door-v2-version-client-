import { apiSlice } from './apiSlice';

export interface INotificationItem {
  _id: string;
  user: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export const notificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<INotificationItem[], void>({
      query: () => '/notification',
      transformResponse: (response: any) => {
        // Backend returns either array directly or { success: true, data: [...] }
        if (Array.isArray(response)) return response;
        if (response && Array.isArray(response.data)) return response.data;
        return [];
      },
      providesTags: ['Notification'],
    }),

    markAsRead: builder.mutation<any, { id: string; read?: boolean }>({
      query: ({ id, read = true }) => ({
        url: `/notification/${id}/read`,
        method: 'PATCH',
        body: { read },
      }),
      invalidatesTags: ['Notification'],
    }),

    markAllAsRead: builder.mutation<any, void>({
      query: () => ({
        url: '/notification/read-all',
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} = notificationApi;

