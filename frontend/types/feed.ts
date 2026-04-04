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
}

export interface GetCommentsRequest {
  postId: string;
  cursor?: string;
}

export interface CreateCommentRequest {
  postId: string;
  content: string;
}

export interface ToggleLikeRequest {
  postId: string;
}
