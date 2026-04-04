import { setCredentials } from "@/store/slices/authSlice";
import { baseApi } from "./baseApi";
import { syncAuthCookie } from "@/app/actions/auth";
import { GetMeResponse } from "@/types/feed";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setCredentials({
              user: data.user,
              token: data.accessToken,
            }),
          );

          await syncAuthCookie(data.accessToken);
        } catch (error) {
          console.log(error);
        }
      },
    }),

    register: builder.mutation({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setCredentials({
              user: data.user,
              token: data.accessToken,
            }),
          );

          await syncAuthCookie(data.accessToken);
        } catch (error) {
          console.log("Registration API error:", error);
        }
      },
    }),

    getMe: builder.query<GetMeResponse, void>({
      query: () => "/auth/me",
      providesTags: ["User"],
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation, useRegisterMutation, useGetMeQuery } = authApi;
