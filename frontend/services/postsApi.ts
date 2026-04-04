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
  ToggleCommentLikeRequest,
  TogglePostLikeRequest,
  GetPostLikesResponse,
  GetPostLikesRequest,
} from "../types/feed";
import { RootState } from "@/store";

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
      query: ({ postId, content, parentId }) => ({
        url: `/posts/${postId}/comments`,
        method: "POST",
        body: { content, parentId },
      }),
      async onQueryStarted({ postId, parentId }, { dispatch, queryFulfilled }) {
        try {
          const { data: newComment } = await queryFulfilled;

          // dispatch(
          //   postsApi.util.updateQueryData(
          //     "getPostComments",
          //     { postId },
          //     (draft) => {
          //       if (!parentId) {
          //         draft.data.unshift(newComment);
          //       } else {
          //         draft.data.push(newComment);
          //       }
          //     },
          //   ),
          // );
          // Replace your current monolithic updateQueryData block entirely with this explicit branching:
          if (!parentId) {
            // 1. If it's a Root Comment, update the master Feed list
            dispatch(
              postsApi.util.updateQueryData(
                "getPostComments",
                { postId },
                (draft) => {
                  draft.data.unshift(newComment);
                },
              ),
            );
          } else {
            // 2. If it's a Reply, specifically target the localized Sub-Collection
            dispatch(
              postsApi.util.updateQueryData(
                "getCommentReplies",
                { postId, commentId: parentId },
                (draft) => {
                  // Create the array if it doesn't exist yet (defensive programming)
                  if (!draft.data) draft.data = [];
                  draft.data.push(newComment);
                },
              ),
            );
          }

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

    togglePostLike: builder.mutation<void, TogglePostLikeRequest>({
      query: ({ postId, isCurrentlyLiked }) => ({
        url: `/posts/${postId}/like`,
        method: isCurrentlyLiked ? "DELETE" : "POST",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Post" as const, id: `LIKES-${arg.postId}` },
      ],
      async onQueryStarted(
        { postId, isCurrentlyLiked },
        { dispatch, queryFulfilled, getState },
      ) {
        const state = getState() as RootState;
        const authUser = state.auth.user;

        const patchResult = dispatch(
          postsApi.util.updateQueryData("getFeed", undefined, (draft) => {
            const targetPost = draft.data.find((p) => p.id === postId);
            if (targetPost) {
              targetPost.isLikedByMe = !targetPost.isLikedByMe;
              targetPost.likesCount += targetPost.isLikedByMe ? 1 : -1;

              if (targetPost.isLikedByMe && authUser) {
                const mockAvatar = {
                  id: authUser.id,
                  firstName: authUser.firstName,
                  lastName: authUser.lastName,
                  avatar: authUser.avatar,
                };
                targetPost.recentLikes.unshift(mockAvatar);
              } else {
                targetPost.recentLikes = targetPost.recentLikes.filter(
                  (u) => u.id !== authUser?.id,
                );
              }
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

    toggleCommentLike: builder.mutation<void, ToggleCommentLikeRequest>({
      query: ({ postId, commentId }) => ({
        url: `/posts/${postId}/comments/${commentId}/like`,
        method: "POST",
      }),
      async onQueryStarted(
        { postId, commentId, parentId },
        { dispatch, queryFulfilled },
      ) {
        const patchDraft = (draft: any) => {
          const target = draft.data.find((c: any) => c.id === commentId);
          if (target) {
            target.isLikedByMe = !target.isLikedByMe;
            target.likesCount += target.isLikedByMe ? 1 : -1;
          }
        };

        let patchResult;

        if (!parentId) {
          patchResult = dispatch(
            postsApi.util.updateQueryData(
              "getPostComments",
              { postId },
              patchDraft,
            ),
          );
        } else {
          patchResult = dispatch(
            // The endpoint is getCommentReplies, and its cache key is { postId, commentId: parentId }
            postsApi.util.updateQueryData(
              "getCommentReplies",
              { postId, commentId: parentId },
              patchDraft,
            ),
          );
        }

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    getCommentReplies: builder.query<
      ApiPaginatedResponse<ApiComment>,
      { postId: string; commentId: string; cursor?: string }
    >({
      query: ({ postId, commentId, cursor }) =>
        cursor
          ? `/posts/${postId}/comments/${commentId}/replies?cursor=${cursor}`
          : `/posts/${postId}/comments/${commentId}/replies`,
      providesTags: (result, error, arg) => [
        { type: "Comment" as const, id: `replies-${arg.commentId}` },
      ],
    }),

    getPostLikes: builder.query<GetPostLikesResponse, GetPostLikesRequest>({
      query: ({ postId, page = 0, limit = 3 }) =>
        `/posts/${postId}/likes?page=${page}&limit=${limit}`,
      providesTags: (result, error, arg) => [
        { type: "Post" as const, id: `LIKES-${arg.postId}` },
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
  useTogglePostLikeMutation,
  useToggleCommentLikeMutation,
  useGetCommentRepliesQuery,
  useGetPostLikesQuery,
} = postsApi;
