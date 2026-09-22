import { ICourse, ICourseResponse } from "@/types/courseTypes";
import { baseApi } from "../../api/baseApi";

export const courseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query<
      ICourseResponse,
      { search?: string; status?: string; page?: number; limit?: number } | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params) {
          if (params.search) queryParams.append("search", params.search);
          if (params.status && params.status !== "All Courses")
            queryParams.append("status", params.status.toUpperCase());
          if (params.page) queryParams.append("page", params.page.toString());
          if (params.limit)
            queryParams.append("limit", params.limit.toString());
        }
        const queryString = queryParams.toString();
        return {
          url: `/courses${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result
          ? [
            ...result.data.map(({ id }) => ({
              type: "Courses" as const,
              id,
            })),
            { type: "Courses", id: "LIST" },
          ]
          : [{ type: "Courses", id: "LIST" }],
    }),
    getSingleCourse: builder.query<
      { success: boolean; message: string; data: ICourse },
      string
    >({
      query: (id) => ({
        url: `/courses/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Courses", id }],
    }),
    getCourseswithoutPagination: builder.query<
      { success: boolean; message: string; data: ICourse[] },
      void
    >({
      query: () => ({
        url: `/courses/all`,
        method: "GET",
      }),
      providesTags: (result, error) => [{ type: "Courses" }],
    }),
    createCourse: builder.mutation<
      { success: boolean; message: string; data: ICourse },
      Partial<ICourse>
    >({
      query: (courseData) => ({
        url: "/courses",
        method: "POST",
        body: courseData,
      }),
      invalidatesTags: [{ type: "Courses", id: "LIST" }],
    }),
    updateCourse: builder.mutation<
      { success: boolean; message: string; data: ICourse },
      { id: string; body: Partial<ICourse> }
    >({
      query: ({ id, body }) => ({
        url: `/courses/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Courses", id: "LIST" },
        { type: "Courses", id },
      ],
    }),
    deleteCourse: builder.mutation<
      { success: boolean; message: string; data: null },
      string
    >({
      query: (id) => ({
        url: `/courses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Courses", id: "LIST" }],
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetSingleCourseQuery,
  useGetCourseswithoutPaginationQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} = courseApi;
