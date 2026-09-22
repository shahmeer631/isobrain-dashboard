import { baseApi } from "../../api/baseApi";
import { IMyCoursesResponse, ISingleCertificateResponse, IUserCertificatesResponse, IUserDashboardResponse, IUserProgressResponse } from "../../../../types/userDashboardTypes";

export const userDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserDashboard: builder.query<IUserDashboardResponse, void>({
      query: () => ({
        url: "/user-dashboard/stats",
        method: "GET",
      }),
      providesTags: ["UserDashboard"],
    }),
    getMyCourses: builder.query<IMyCoursesResponse, void>({
      query: () => ({
        url: "/user-dashboard/my-courses",
        method: "GET",
      }),
      providesTags: ["UserDashboard"],
    }),
    getUserProgress: builder.query<IUserProgressResponse, void>({
      query: () => ({
        url: "/user-dashboard/progress",
        method: "GET",
      }),
      providesTags: ["UserDashboard"],
    }),
    getUserCertificates: builder.query<{ success: boolean; message: string; data: any[] }, void>({
      query: () => ({
        url: "/certificates/my-certificates",
        method: "GET",
      }),
      providesTags: ["UserDashboard"],
    }),
    getSingleCertificate: builder.query<ISingleCertificateResponse, string>({
      query: (id) => ({
        url: `/certificates/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "UserDashboard", id }],
    }),
    downloadCertificate: builder.query<Blob, string>({
      query: (courseId) => ({
        url: `/certificates/download/${courseId}`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const { 
  useGetUserDashboardQuery, 
  useGetMyCoursesQuery, 
  useGetUserProgressQuery, 
  useGetUserCertificatesQuery,
  useGetSingleCertificateQuery,
  useLazyGetSingleCertificateQuery,
  useLazyDownloadCertificateQuery
} = userDashboardApi;
