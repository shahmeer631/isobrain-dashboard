import { baseApi } from '../../api/baseApi';
import { GroupData, GroupMember } from '@/components/dashboard/(admin)/users/GroupCard';

export interface GroupDetail extends GroupData {
  members: GroupMember[];
}

export interface GroupResponse {
  success: boolean;
  message: string;
  data: GroupData;
}

export interface IGetGroupsResponse {
  success: boolean;
  message: string;
  data: {
    data: GroupData[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPage: number;
    };
  };
}

export const groupApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGroups: builder.query<IGetGroupsResponse, void>({
      query: () => ({
        url: '/groups',
        method: 'GET',
      }),
      providesTags: ['Groups'],
    }),
    getGroup: builder.query<{ success: boolean; message: string; data: GroupDetail }, string>({
      query: (id) => ({
        url: `/groups/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Groups', id }],
    }),
    createGroup: builder.mutation<{ success: boolean; message: string; data: GroupData }, Partial<GroupData>>({
      query: (body) => ({
        url: '/groups',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Groups'],
    }),
    updateGroup: builder.mutation<{ success: boolean; message: string; data: GroupData }, { id: string; body: Partial<GroupData> }>({
      query: ({ id, body }) => ({
        url: `/groups/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        'Groups',
        { type: 'Groups', id },
      ],
    }),
    deleteGroup: builder.mutation<{ success: boolean; message: string; data: GroupData }, string>({
      query: (id) => ({
        url: `/groups/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        'Groups',
        { type: 'Groups', id },
      ],
    }),
    addUsersToGroup: builder.mutation<
      { success: boolean; message: string; data: { message: string; added?: number; skipped?: number } },
      { groupId: string; userIds: string[] }
    >({
      // Legacy path — available on current production AND local backends
      query: ({ groupId, userIds }) => ({
        url: `/groups/add-users`,
        method: 'POST',
        body: { groupId, userIds },
      }),
      invalidatesTags: (result, error, { groupId }) => [
        'Groups',
        { type: 'Groups', id: groupId },
      ],
    }),
    removeUserFromGroup: builder.mutation<
      { success: boolean; message: string; data: { message: string } },
      { groupId: string; userId: string }
    >({
      query: ({ groupId, userId }) => ({
        url: `/groups/${groupId}/members/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { groupId }) => [
        'Groups',
        { type: 'Groups', id: groupId },
      ],
    }),
  }),
});

export const { 
  useGetGroupsQuery,
  useGetGroupQuery,
  useCreateGroupMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
  useAddUsersToGroupMutation,
  useRemoveUserFromGroupMutation,
} = groupApi;
