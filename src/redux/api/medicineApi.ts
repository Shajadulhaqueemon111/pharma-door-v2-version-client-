import { apiSlice } from './apiSlice';

export interface MedicineItem {
  _id: string;
  name: string;
  brand: string;
  stock: string | number;
  price: string | number;
  medicineImage: string;
  genericName?: string;
  medicineType?: string;
  manufactureDate?: string;
  expiryDate?: string;
  description?: string;
  dosage?: string;
  form?: string;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export const medicineApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMedicines: builder.query<MedicineItem[], void>({
      query: () => '/medicine',
      transformResponse: (response: { success: boolean; data: MedicineItem[] }) =>
        response?.data || [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Medicine' as const, id: _id })),
              { type: 'Medicine', id: 'LIST' },
            ]
          : [{ type: 'Medicine', id: 'LIST' }],
    }),

    getSingleMedicine: builder.query<MedicineItem, string>({
      query: (id) => `/medicine/${id}`,
      transformResponse: (response: { success: boolean; data: MedicineItem }) =>
        response?.data,
      providesTags: (_result, _error, id) => [{ type: 'Medicine', id }],
    }),

    createMedicine: builder.mutation<MedicineItem, Partial<MedicineItem>>({
      query: (payload) => ({
        url: '/medicine',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'Medicine', id: 'LIST' }],
    }),

    updateMedicine: builder.mutation<
      MedicineItem,
      { id: string; data: Partial<MedicineItem> }
    >({
      query: ({ id, data }) => ({
        url: `/medicine/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Medicine', id },
        { type: 'Medicine', id: 'LIST' },
      ],
    }),

    deleteMedicine: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/medicine/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Medicine', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetMedicinesQuery,
  useGetSingleMedicineQuery,
  useCreateMedicineMutation,
  useUpdateMedicineMutation,
  useDeleteMedicineMutation,
} = medicineApi;

