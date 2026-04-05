"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FeedAvatar } from "./FeedAvatar";
import { ApiPost, ComposerRequestPayload } from "@/types/feed";
import { getRelativeTime } from "@/lib/time";
import {
  useCreatePostCommentMutation,
  useGetPostCommentsQuery,
  useTogglePostLikeMutation,
} from "@/services/postsApi";
import { CommentThread } from "./CommentThread";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export function FeedPostCard({ post }: { post: ApiPost }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [activeReplyConfig, setActiveReplyConfig] = useState<{
    threadId: string;
    replyToId: string | null;
  } | null>(null);
  const [replyContextName, setReplyContextName] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const [createComment, { isLoading: isPosting }] =
    useCreatePostCommentMutation();
  const {
    data: commentsResponse,
    isFetching,
    isLoading,
    isError,
  } = useGetPostCommentsQuery({ postId: post.id }, { skip: !showComments });
  const [toggleLike] = useTogglePostLikeMutation();

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && commentText.trim() && !isPosting) {
      if (!activeReplyConfig) {
        await createComment({ postId: post.id, content: commentText }).unwrap();
      } else {
        await createComment({
          postId: post.id,
          content: commentText,
          threadId: activeReplyConfig.threadId,
          replyToId: activeReplyConfig.replyToId ?? activeReplyConfig.threadId,
        }).unwrap();
      }
      setReplyContextName(null);
      setCommentText("");
    }
  };

  const handleReplyRequest = (payload: ComposerRequestPayload) => {
    setActiveReplyConfig({
      threadId: payload.threadId,
      replyToId: payload.replyToId,
    });
    setReplyContextName(payload.authorName);
  };

  useEffect(() => {
    if (activeReplyConfig && inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeReplyConfig]);

  return (
    <article className="mb-4 overflow-hidden rounded-md bg-card shadow-sm">
      <div className="border-b border-black/5 px-6 pb-4 pt-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 gap-3">
            <FeedAvatar
              name={`${post.author.firstName} ${post.author.lastName}`}
              seed={post.authorId}
              size="md"
            />
            <div className="min-w-0">
              <h4 className="font-medium text-fg mb-1 capitalize">{`${post.author.firstName} ${post.author.lastName}`}</h4>
              <p className="text-sm text-fg capitalize">
                {getRelativeTime(post.createdAt)} ·{" "}
                <Link href="#" className="text-primary hover:underline">
                  {post.visibility === "public" ? "Public" : "Private"}
                </Link>
              </p>
            </div>
          </div>

          <div className="relative shrink-0" ref={menuRef}>
            <button
              type="button"
              className="rounded p-1 text-fg hover:bg-black/5"
              aria-expanded={menuOpen}
              aria-label="Post options"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="4"
                height="17"
                fill="none"
                viewBox="0 0 4 17"
              >
                <circle cx="2" cy="2" r="2" fill="currentColor" />
                <circle cx="2" cy="8" r="2" fill="currentColor" />
                <circle cx="2" cy="15" r="2" fill="currentColor" />
              </svg>
            </button>
            {menuOpen && (
              <ul className="absolute right-0 top-full z-20 mt-1 w-52 rounded-md border border-black/10 bg-card py-1 text-sm shadow-lg">
                <li>
                  <Link
                    href="#"
                    className="flex items-center gap-2 px-3 py-2 hover:bg-border"
                  >
                    <span className="text-primary">Save Post</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="flex items-center gap-2 px-3 py-2 hover:bg-border"
                  >
                    Turn On Notification
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="flex items-center gap-2 px-3 py-2 hover:bg-border"
                  >
                    Hide
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="flex items-center gap-2 px-3 py-2 hover:bg-border"
                  >
                    Edit Post
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-border"
                  >
                    Delete Post
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
        <h3 className="mt-4 text-base text-fg">{post.content}</h3>
        {post.imageUrl && (
          <Image
            className={`mt-4 aspect-video w-full rounded-md`}
            src={post.imageUrl}
            alt="post image"
            width={1280}
            height={720}
            loading="eager"
          />
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-y-2 px-4 py-4 pb-3 sm:px-6">
        <div className="flex shrink-0 items-center">
          <span className="flex -space-x-[16px]">
            {post.recentLikes?.map((user, i) => (
              <Image
                key={i}
                src={"/assets/images/react_img1.png"}
                alt="user"
                width={36}
                height={36}
                loading="eager"
                className="h-9 w-9 shrink-0 rounded-full border-2 border-white object-cover"
              />
            ))}
            {(post.likesCount || 0) > (post.recentLikes?.length || 0) && (
              <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-white bg-primary text-[14px] font-semibold text-white">
                +{(post.likesCount || 0) - (post.recentLikes?.length || 0)}
              </span>
            )}
          </span>
        </div>

        <div className="flex shrink-0 gap-3 text-[14px] sm:text-[15px] font-medium text-[#8C9AA9] sm:gap-4">
          <button
            type="button"
            className="hover:text-primary transition-colors"
          >
            <span className="text-fg mr-1.5">{post.commentsCount}</span>
            Comment
          </button>
          <button
            type="button"
            className="hover:text-primary transition-colors"
          >
            <span className="text-fg mr-1.5">12</span>
            Share
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 w-full border-y border-black/5">
        <button
          type="button"
          onClick={() =>
            toggleLike({ postId: post.id, isCurrentlyLiked: post.isLikedByMe })
          }
          className={`flex items-center justify-center gap-2 py-3 text-[15px] font-medium transition-colors ${
            post.isLikedByMe
              ? "bg-[#EAF4FF] text-primary"
              : "text-fg hover:bg-border"
          }`}
        >
          {/* A classic Thumbs Up icon. Filled if liked, outlined if not. */}
          <svg
            className={post.isLikedByMe ? "text-primary" : "text-fg"}
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill={post.isLikedByMe ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={post.isLikedByMe ? "0" : "1.5"}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"
            />
          </svg>
          {post.isLikedByMe ? "Liked" : "Like"}
        </button>

        <button
          type="button"
          onClick={() => {
            setShowComments(!showComments);
            setActiveReplyConfig(null);
            setReplyContextName(null);
          }}
          className="flex items-center justify-center gap-2 py-3 text-[15px] font-medium text-fg hover:bg-border transition-colors"
        >
          <svg
            className="text-fg"
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
            />
          </svg>
          Comment
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-2 py-3 text-[15px] font-medium text-fg hover:bg-border transition-colors"
        >
          <svg
            className="text-fg"
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
            />
          </svg>
          Share
        </button>
      </div>

      {showComments && (
        <div className="px-6 pb-6 mt-6 flex flex-col gap-6">
          {post.commentsCount != null && post.commentsCount > 0 && (
            <button
              type="button"
              onClick={() => setShowComments(!showComments)}
              className="text-left text-[15.5px] font-medium text-fg hover:text-primary"
            >
              View {post.commentsCount} comments
            </button>
          )}

          {isLoading || isFetching ? (
            <div className="flex items-center justify-center my-2">
              <span className="loader"></span>
            </div>
          ) : null}

          {post.commentsCount != null && post.commentsCount > 0 && (
            <>
              <div className="flex flex-col">
                {commentsResponse?.data
                  .filter((c) => !c.parentId)
                  .map((c) => (
                    <CommentThread
                      key={c.id}
                      post={post}
                      comment={c}
                      isActiveComposer={activeReplyConfig?.threadId === c.id}
                      onRequestComposer={handleReplyRequest}
                      onReleaseComposer={() => setActiveReplyConfig(null)}
                    />
                  ))}
              </div>
            </>
          )}

          {
            <div className="flex items-center gap-3 rounded-full bg-border p-2 pr-4 w-full">
              <div className="shrink-0">
                <FeedAvatar
                  name={
                    currentUser?.firstName + " " + currentUser?.lastName || ""
                  }
                  seed={
                    currentUser?.firstName + " " + currentUser?.lastName || ""
                  }
                  // image="/assets/images/txt_img.png"
                  size="xs"
                />
              </div>
              <div className="relative min-w-0 flex-1 flex items-center">
                <label htmlFor={`comment-${post.id}`} className="sr-only">
                  Write a comment
                </label>
                <input
                  id={`comment-${post.id}`}
                  placeholder={
                    !activeReplyConfig
                      ? "Write a comment..."
                      : `Replying to @${replyContextName}...`
                  }
                  autoFocus={!!activeReplyConfig}
                  ref={inputRef}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isPosting}
                  className="w-full bg-transparent text-[15.5px] text-fg placeholder:text-fg outline-none"
                />
              </div>

              <div className="flex shrink-0 items-center gap-3 text-fg">
                <button
                  type="button"
                  className="hover:text-primary transition-colors"
                  aria-label="Microphone"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="19"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" x2="12" y1="19" y2="22" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="hover:text-[#1890FF] transition-colors"
                  aria-label="Attach Photo"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="4" ry="4" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                </button>
              </div>

              {!!activeReplyConfig && (
                <button
                  type="button"
                  aria-label="Cancel Reply"
                  onClick={() => {
                    // setShowComments(!showComments);
                    setActiveReplyConfig(null);
                    setReplyContextName(null);
                  }}
                  className="rounded-full bg-fg px-2 py-1 text-[12px] font-medium text-fg hover:bg-border transition-colors border border-bg"
                >
                  Cancel
                </button>
              )}
            </div>
          }
        </div>
      )}
    </article>
  );
}
