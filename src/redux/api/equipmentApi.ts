import { apiSlice } from './apiSlice';

export interface EquipmentItem {
  _id: string;
  name: string;
  brand: string;
  category: string;
  price: string | number;
  stock_quantity: number;
  rating: number;
  color: string;
  medicineImage?: string;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export const equipmentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEquipments: builder.query<EquipmentItem[], void>({
      query: () => '/equipment',
      transformResponse: (response: { success: boolean; data: EquipmentItem[] }) =>
        response?.data || [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Equipment' as const, id: _id })),
              { type: 'Equipment', id: 'LIST' },
            ]
          : [{ type: 'Equipment', id: 'LIST' }],
    }),

    getSingleEquipment: builder.query<EquipmentItem, string>({
      query: (id) => `/equipment/${id}`,
      transformResponse: (response: { success: boolean; data: EquipmentItem }) =>
        response?.data,
      providesTags: (_result, _error, id) => [{ type: 'Equipment', id }],
    }),

    createEquipment: builder.mutation<EquipmentItem, Partial<EquipmentItem>>({
      query: (payload) => ({
        url: '/equipment/create-equipment',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'Equipment', id: 'LIST' }],
    }),

    updateEquipment: builder.mutation<
      EquipmentItem,
      { id: string; data: any }
    >({
      query: ({ id, data }) => ({
        url: `/equipment/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Equipment', id },
        { type: 'Equipment', id: 'LIST' },
      ],
    }),

    deleteEquipment: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/equipment/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Equipment', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetEquipmentsQuery,
  useGetSingleEquipmentQuery,
  useCreateEquipmentMutation,
  useUpdateEquipmentMutation,
  useDeleteEquipmentMutation,
} = equipmentApi;

