/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiSlice } from './apiSlice';

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Customer Endpoints
    getMyOrders: builder.query<any, any>({
      query: (params = {}) => ({
        url: '/order/my-orders',
        method: 'GET',
        params,
      }),
      providesTags: ['Order'],
    }),

    getMyOrderDetails: builder.query<any, string>({
      query: (orderId) => `/order/my-orders/${orderId}`,
      providesTags: (_result, _error, id) => [{ type: 'Order', id }],
    }),

    getOrderTracking: builder.query<any, string>({
      query: (orderId) => `/order/my-orders/${orderId}/track`,
      providesTags: (_result, _error, id) => [{ type: 'Order', id: `TRACK_${id}` }],
    }),

    cancelMyOrder: builder.mutation<any, { orderId: string; reason?: string }>({
      query: ({ orderId, reason }) => ({
        url: `/order/my-orders/${orderId}/cancel`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: ['Order'],
    }),

    // Pharmacist & Admin Endpoints
    getStaffOrders: builder.query<any, any>({
      query: (params = {}) => ({
        url: '/order/ordered-medicine',
        method: 'GET',
        params,
      }),
      providesTags: ['Order'],
    }),

    updateOrderStatus: builder.mutation<
      any,
      {
        orderId: string;
        status: string;
        note?: string;
        estimatedDeliveryDate?: string | Date;
        deliveryInfo?: any;
        internalNotes?: string;
      }
    >({
      query: ({ orderId, ...body }) => ({
        url: `/order/${orderId}/status`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Order'],
    }),

    assignDeliveryInfo: builder.mutation<
      any,
      {
        orderId: string;
        carrier?: string;
        trackingNumber?: string;
        assignedRiderName?: string;
        assignedRiderPhone?: string;
        estimatedDeliveryDate?: string | Date;
      }
    >({
      query: ({ orderId, ...body }) => ({
        url: `/order/${orderId}/assign-delivery`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const {
  useGetMyOrdersQuery,
  useGetMyOrderDetailsQuery,
  useGetOrderTrackingQuery,
  useCancelMyOrderMutation,
  useGetStaffOrdersQuery,
  useUpdateOrderStatusMutation,
  useAssignDeliveryInfoMutation,
} = orderApi;

