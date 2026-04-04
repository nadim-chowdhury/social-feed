import { baseApi } from "./baseApi";
import type { PostEntity, CursorPaginatedResponse } from "../types/feed";

export const postsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFeed: builder.query<CursorPaginatedResponse<PostEntity>, string | void>({
      query: (cursor) => (cursor ? `/posts?cursor=${cursor}` : "/posts"),
      providesTags: ["Post"],
    }),
  }),
});

export const { useGetFeedQuery } = postsApi;
