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
      async onQueryStarted({ postId }, { dispatch, queryFulfilled }) {
        try {
          const { data: newComment } = await queryFulfilled;

          dispatch(
            postsApi.util.updateQueryData(
              "getPostComments",
              { postId },
              (draft) => {
                if (draft?.data) {
                  draft.data.unshift(newComment);
                }
              },
            ),
          );
          dispatch(
            postsApi.util.updateQueryData("getFeed", undefined, (draft) => {
              if (draft?.data) {
                const targetPost = draft.data.find((p) => p.id === postId);
                if (targetPost && targetPost.commentsCount !== undefined) {
                  targetPost.commentsCount += 1;
                }
              }
            }),
          );
        } catch (error) {
          console.error("Pessimistic update failed");
        }
      },
    }),

    togglePostLike: builder.mutation<void, { postId: string }>({
      query: ({ postId }) => ({
        url: `/posts/${postId}/like`,
        method: "POST",
      }),
      async onQueryStarted({ postId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          postsApi.util.updateQueryData("getFeed", undefined, (draft) => {
            const targetPost = draft.data.find((p) => p.id === postId);
            if (targetPost) {
              targetPost.isLikedByMe = !targetPost.isLikedByMe;
              targetPost.likesCount += targetPost.isLikedByMe ? 1 : -1;
            }
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    toggleCommentLike: builder.mutation<
      void,
      { postId: string; commentId: string }
    >({
      query: ({ postId, commentId }) => ({
        url: `/posts/${postId}/comments/${commentId}/like`,
        method: "POST",
      }),
      async onQueryStarted(
        { postId, commentId },
        { dispatch, queryFulfilled },
      ) {
        const patchResult = dispatch(
          postsApi.util.updateQueryData(
            "getPostComments",
            { postId },
            (draft) => {
              const targetComment = draft.data.find((c) => c.id === commentId);
              if (targetComment) {
                targetComment.isLikedByMe = !targetComment.isLikedByMe;
                targetComment.likesCount += targetComment.isLikedByMe ? 1 : -1;
              }
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetFeedQuery,
  useGetUploadSignatureMutation,
  useCreatePostMutation,
  useGetPostCommentsQuery,
  useCreatePostCommentMutation,
  useTogglePostLikeMutation,
  useToggleCommentLikeMutation,
} = postsApi;
