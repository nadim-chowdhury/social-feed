export interface UserSnippet {
  id: string;
  username: string;
  avatarUrl?: string;
}

export interface PostEntity {
  id: string;
  content: string;
  author: UserSnippet;
  createdAt: string;
}

export interface CursorPaginatedResponse<T> {
  data: T[];
  nextCursor?: string | null;
}

export interface UploadSignatureResponse {
  timestamp: number;
  signature: string;
  cloudName: string;
  apiKey: string;
  folder: string;
}

export interface CreatePostRequest {
  content?: string | null;
  imageUrl?: string | null;
  visibility?: "PUBLIC" | "PRIVATE" | "FRIENDS";
}

export type OrchestrationStatus =
  | "IDLE"
  | "SIGNING"
  | "UPLOADING_CLOUD"
  | "PUBLISHING"
  | "FAILED";

export type FileSelectionHandler = (
  event: React.ChangeEvent<HTMLInputElement>,
) => void;

export type ImagePreviewState = string | null;

export interface CloudinaryResponse {
  secure_url?: string;
  error?: { message: string };
}

export interface CloudinaryDirectUploadFormData {
  file: File;
  api_key: string;
  timestamp: string;
  signature: string;
  folder?: string;
}

export interface ApiUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiPost {
  id: string;
  content: string;
  imageUrl: string | null;
  visibility: "public" | "private" | "friends";
  author: ApiUser;
  authorId: string;
  likesCount: number;
  commentsCount: number;
  isLikedByMe: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiPaginatedResponse<T> {
  data: T[];
  meta: { hasNextPage: boolean; nextCursor: string | null };
}

export type RelativeTimeFormatter = (isoString: string) => string;

export interface ApiComment {
  id: string;
  content: string;
  postId: string;
  author: ApiUser;
  createdAt: string;
  reactionsCount: number;
  parentId?: string | null;
  replyCount: number;
  likesCount: number;
  isLikedByMe: boolean;
}

export interface GetCommentsRequest {
  postId: string;
  cursor?: string;
}

export interface CreateCommentRequest {
  postId: string;
  content: string;
  parentId?: string;
}

export interface ToggleLikeRequest {
  postId: string;
}

export type ToggleCommentLikeHandler = (args: {
  postId: string;
  commentId: string;
  parentId?: string;
}) => Promise<void>;

export type QueryResolver = (args: {
  postId: string;
  commentId: string;
  parentId?: string;
}) => {
  url: string;
  method: string;
};

export type ResolveRootParentFn = (targetNode: ApiComment) => string;

export type ValidatedKeyboardExecution = (
  e: React.KeyboardEvent<HTMLInputElement>,
  rootNode: ApiComment,
) => Promise<void>;

export type RootProjectionFilter = (comment: ApiComment) => boolean;

export interface CommentThreadNode {
  replies: ApiComment[];
  activeComposerId: string | null;
}

export type CacheUpdater = (draft: ApiPaginatedResponse<ApiComment>) => void;

export interface GetRepliesRequest {
  postId: string;
  commentId: string;
  parentId?: string;
  cursor?: string;
}

export interface CommentThreadProps {
  post: ApiPost;
  comment: ApiComment;
  isReplying?: boolean;
  onReplyClick?: () => void;
  isComposerOpen?: boolean;
  setIsComposerOpen?: (value: boolean) => void;
}

export type MutationEvent = {
  postId: string;
  parentId?: string;
  newComment: ApiComment;
};

export interface CacheDispatcher {
  routePatch(event: MutationEvent): void;
}

export type ThreadState = {
  fixedId: string;
  isComposerOpen: boolean;
};

export interface CommentNodeProps {
  comment: ApiComment;
  isNested: boolean;
  onReplyClick: () => void;
  onLikeClick: () => void;
}

export type FeedPostControllerState = {
  activeComposerId: string;
};

export interface CommentThreadProps {
  post: ApiPost;
  comment: ApiComment;
  isActiveComposer: boolean;
  onReleaseComposer: () => void;
  onRequestComposer: (payload: ComposerRequestPayload) => void;
}

export interface ComposerRequestPayload {
  targetId: string;
  authorName: string;
}

export interface ToggleCommentLikeRequest {
  postId: string;
  commentId: string;
  parentId?: string;
}

export interface TogglePostLikeRequest {
  postId: string;
  isCurrentlyLiked: boolean;
}

export interface GetPostLikesRequest {
  postId: string;
  page?: number;
  limit?: number;
}
export interface GetPostLikesResponse {
  data: ApiUser[];
  total: number;
}
