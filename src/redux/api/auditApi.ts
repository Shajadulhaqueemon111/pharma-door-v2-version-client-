import { apiSlice } from './apiSlice';

export interface IAuditLogItem {
  _id: string;
  user?: string;
  userName: string;
  userEmail: string;
  userRole: string;
  action: string;
  target: string;
  targetId?: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

export const auditApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAuditLogs: builder.query<IAuditLogItem[], { limit?: number } | void>({
      query: (params) => ({
        url: '/audit-logs',
        params: { limit: params?.limit || 100 },
      }),
      transformResponse: (response: any) => {
        if (response && response.data) return response.data;
        if (Array.isArray(response)) return response;
        return [];
      },
      providesTags: ['Audit'],
    }),

    recordAuditLog: builder.mutation<
      any,
      {
        action: string;
        target: string;
        targetId?: string;
        details?: string;
      }
    >({
      query: (data) => ({
        url: '/audit-logs',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Audit'],
    }),
  }),
});

export const { useGetAuditLogsQuery, useRecordAuditLogMutation } = auditApi;

