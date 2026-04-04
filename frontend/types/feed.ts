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
