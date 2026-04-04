import { baseApi } from "./baseApi";
import type {
  PostEntity,
  UploadSignatureResponse,
  CreatePostRequest,
  ApiPaginatedResponse,
  ApiPost,
  ApiComment,
  GetCommentsRequest,
  CreateCommentRequest,
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

    getPostComments: builder.query<
      ApiPaginatedResponse<ApiComment>,
      GetCommentsRequest
    >({
      query: ({ postId, cursor }) =>
        cursor
          ? `/posts/${postId}/comments?cursor=${cursor}`
          : `/posts/${postId}/comments`,
      providesTags: (result, error, arg) => [
        { type: "Comment" as const, id: arg.postId },
      ],
    }),

    createPostComment: builder.mutation<ApiComment, CreateCommentRequest>({
      query: ({ postId, content }) => ({
        url: `/posts/${postId}/comments`,
        method: "POST",
        body: { content },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Comment", id: arg.postId },
      ],
    }),
  }),
});

export const {
  useGetFeedQuery,
  useGetUploadSignatureMutation,
  useCreatePostMutation,
  useGetPostCommentsQuery,
  useCreatePostCommentMutation,
} = postsApi;
