import { baseApi } from "./baseApi";
import type {
  PostEntity,
  UploadSignatureResponse,
  CreatePostRequest,
  ApiPaginatedResponse,
  ApiPost,
} from "../types/feed";

export const postsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFeed: builder.query<ApiPaginatedResponse<ApiPost>, string | void>({
      query: (cursor) => (cursor ? `/posts?cursor=${cursor}` : "/posts"),
      providesTags: ["Post"],
    }),

    getUploadSignature: builder.mutation<UploadSignatureResponse, void>({
      query: () => ({ url: "/uploads/signature", method: "POST" }),
    }),

    createPost: builder.mutation<PostEntity, CreatePostRequest>({
      query: (body) => ({
        url: "/posts",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Post"],
    }),
  }),
});

export const {
  useGetFeedQuery,
  useGetUploadSignatureMutation,
  useCreatePostMutation,
} = postsApi;
