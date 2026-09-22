import { baseApi } from "../../api/baseApi";
import {
  ICertificateDashboardResponse,
  ICertificateResponse,
  ICreateCertificateRequest,
  IUpdateCertificateRequest,
} from "@/types/certificateTypes";

export const certificateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCertificatesDashboard: builder.query<ICertificateDashboardResponse, void>({
      query: () => ({
        url: "/certificates/stats",
        method: "GET",
      }),
      providesTags: ["Certificates"],
    }),

    createCertificateTemplate: builder.mutation<ICertificateResponse, ICreateCertificateRequest>({
      query: (body) => ({
        url: "/certificates/templates",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Certificates"],
    }),

    updateCertificateTemplate: builder.mutation<
      ICertificateResponse,
      { id: string; body: IUpdateCertificateRequest }
    >({
      query: ({ id, body }) => ({
        url: `/certificates/templates/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Certificates"],
    }),

    deleteCertificateTemplate: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/certificates/templates/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Certificates"],
    }),

    issueCertificate: builder.mutation<{ success: boolean; message: string }, { userId: string; courseId: string; templateId: string }>({
      query: (body) => ({
        url: "/certificates/issue",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Certificates"],
    }),
  }),
});

export const {
  useGetCertificatesDashboardQuery,
  useCreateCertificateTemplateMutation,
  useUpdateCertificateTemplateMutation,
  useDeleteCertificateTemplateMutation,
  useIssueCertificateMutation,
} = certificateApi;
