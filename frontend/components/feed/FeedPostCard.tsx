"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { FeedPost } from "@/lib/feed-data";
import { currentUser } from "@/lib/feed-data";
import { FeedAvatar } from "./FeedAvatar";
import { ApiPost } from "@/types/feed";
import { getRelativeTime } from "@/lib/time";
import {
  useCreatePostCommentMutation,
  useGetPostCommentsQuery,
  useTogglePostLikeMutation,
} from "@/services/postsApi";

export function FeedPostCard({ post }: { post: ApiPost }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const menuRef = useRef<HTMLDivElement>(null);
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
      console.log("🔥 DISPATCHING MUTATION:", {
        postId: post.id,
        content: commentText,
      });

      try {
        await createComment({ postId: post.id, content: commentText }).unwrap();
        setCommentText("");
        setShowComments(true);
      } catch (error) {
        console.error("Comment failed:", error);
      }
    }
  };

  return (
    <article className="mb-4 overflow-hidden rounded-md bg-white shadow-sm">
      <div className="border-b border-black/5 px-6 pb-4 pt-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 gap-3">
            <FeedAvatar
              name={`${post.author.firstName} ${post.author.lastName}`}
              seed={post.authorId}
              size="lg"
            />
            <div className="min-w-0">
              <h4 className="font-medium text-[#112032] mb-1 capitalize">{`${post.author.firstName} ${post.author.lastName}`}</h4>
              <p className="text-sm text-[#666] capitalize">
                {getRelativeTime(post.createdAt)} ·{" "}
                <Link href="#" className="text-[#1890FF] hover:underline">
                  {post.visibility}
                </Link>
              </p>
            </div>
          </div>

          <div className="relative shrink-0" ref={menuRef}>
            <button
              type="button"
              className="rounded p-1 text-[#C4C4C4] hover:bg-black/5"
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
              <ul className="absolute right-0 top-full z-20 mt-1 w-52 rounded-md border border-black/10 bg-white py-1 text-sm shadow-lg">
                <li>
                  <Link
                    href="#"
                    className="flex items-center gap-2 px-3 py-2 hover:bg-black/5"
                  >
                    <span className="text-[#1890FF]">Save Post</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="flex items-center gap-2 px-3 py-2 hover:bg-black/5"
                  >
                    Turn On Notification
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="flex items-center gap-2 px-3 py-2 hover:bg-black/5"
                  >
                    Hide
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="flex items-center gap-2 px-3 py-2 hover:bg-black/5"
                  >
                    Edit Post
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-black/5"
                  >
                    Delete Post
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
        <h3 className="mt-4 text-base text-[#112032]">{post.content}</h3>
        {post.imageUrl && (
          <Image
            className={`mt-4 aspect-video w-full rounded-md`}
            src={post.imageUrl}
            alt="post image"
            width={1280}
            height={720}
          />
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-y-2 px-4 py-4 pb-3 sm:px-6">
        <div className="flex shrink-0 items-center">
          <span className="flex -space-x-[10px]">
            {[
              "/assets/images/react_img1.png",
              "/assets/images/react_img2.png",
              "/assets/images/react_img3.png",
            ].map((img, i) => (
              <Image
                key={i}
                src={img}
                alt="user"
                width={36}
                height={36}
                className="h-9 w-9 shrink-0 rounded-full border-2 border-white object-cover"
              />
            ))}
            <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-white bg-[#1890FF] text-[14px] font-semibold text-white">
              9+
            </span>
          </span>
        </div>

        <div className="flex shrink-0 gap-3 text-[14px] sm:text-[15px] font-medium text-[#8C9AA9] sm:gap-4">
          <button
            type="button"
            className="hover:text-[#1890FF] transition-colors"
          >
            <span className="text-[#112032] mr-1.5">{post.commentsCount}</span>
            Comment
          </button>
          <button
            type="button"
            className="hover:text-[#1890FF] transition-colors"
          >
            <span className="text-[#112032] mr-1.5">12</span>
            Share
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 w-full border-y border-black/5">
        {/* <button
          type="button"
          className="flex items-center justify-center gap-2 bg-[#EAF4FF] py-3 text-[15px] font-medium text-[#112032]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="19"
            fill="none"
            viewBox="0 0 19 19"
            aria-hidden
          >
            <path
              fill="#FFCC4D"
              d="M9.5 19a9.5 9.5 0 100-19 9.5 9.5 0 000 19z"
            />
            <path
              fill="#664500"
              d="M9.5 11.083c-1.912 0-3.181-.222-4.75-.527-.358-.07-1.056 0-1.056 1.055 0 2.111 2.425 4.75 5.806 4.75 3.38 0 5.805-2.639 5.805-4.75 0-1.055-.697-1.125-1.055-1.055-1.57.305-2.838.527-4.75.527z"
            />
          </svg>
          Haha
        </button> */}
        <button
          type="button"
          onClick={() => toggleLike({ postId: post.id })}
          className={`flex items-center justify-center gap-2 py-3 text-[15px] font-medium transition-colors ${
            post.isLikedByMe
              ? "bg-[#EAF4FF] text-[#1890FF]"
              : "text-[#112032] hover:bg-[#F8F9FB]"
          }`}
        >
          {/* A classic Thumbs Up icon. Filled if liked, outlined if not. */}
          <svg
            className={post.isLikedByMe ? "text-[#1890FF]" : "text-[#112032]"}
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
          onClick={() => setShowComments(!showComments)}
          className="flex items-center justify-center gap-2 py-3 text-[15px] font-medium text-[#112032] hover:bg-[#F8F9FB] transition-colors"
        >
          <svg
            className="text-[#112032]"
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
          className="flex items-center justify-center gap-2 py-3 text-[15px] font-medium text-[#112032] hover:bg-[#F8F9FB] transition-colors"
        >
          <svg
            className="text-[#112032]"
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
              className="text-left text-[15.5px] font-medium text-[#516170] hover:text-[#1890FF]"
            >
              View {post.commentsCount} comments
            </button>
          )}

          {post.commentsCount != null && post.commentsCount > 0 && (
            <div className="flex flex-col gap-6">
              {commentsResponse?.data.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <Link href="#" className="shrink-0 mt-1">
                    <FeedAvatar
                      name={c.author.firstName + " " + c.author.lastName}
                      seed={c.author.avatar || ""}
                      image="/assets/images/txt_img.png"
                      size="sm"
                    />
                  </Link>
                  <div className="min-w-0 flex-1 flex flex-col items-start w-full">
                    <div className="relative w-[95%] rounded-2xl bg-[#F5F5F5] px-4 py-3 pb-4">
                      <Link
                        href="#"
                        className="font-medium text-[15px] text-[#112032] hover:underline capitalize"
                      >
                        {c.author.firstName + " " + c.author.lastName}
                      </Link>
                      <p className="mt-1 text-[15.5px] leading-relaxed text-[#516170]">
                        {c.content}
                      </p>

                      <span className="absolute -bottom-[14px] right-4 flex items-center gap-1 shadow-[0_2px_8px_rgba(0,0,0,0.08)] rounded-full bg-white px-2 py-[3px] text-[13px] font-semibold text-[#112032] border border-black/5">
                        <div className="flex items-center -space-x-[6px] mr-1">
                          <span className="relative z-10 rounded-full bg-white border-2 border-white flex justify-center items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#1890FF"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="p-[1.5px] bg-[#EAF4FF] rounded-full"
                            >
                              <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
                            </svg>
                          </span>
                          <span className="rounded-full bg-white border-2 border-white flex justify-center items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#FF4D4F"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="p-[1.5px] bg-[#FFF1F0] rounded-full"
                            >
                              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                            </svg>
                          </span>
                        </div>
                        10
                      </span>
                    </div>

                    <div className="mt-3 px-1 flex gap-1.5 text-[14.5px] font-medium text-[#112032]">
                      <button type="button" className="hover:text-[#1890FF]">
                        Like
                      </button>
                      <span className="text-[#112032]">.</span>
                      <button
                        type="button"
                        className="hover:text-[#1890FF]"
                        onClick={() =>
                          setReplyToId(replyToId === c.id ? null : c.id)
                        }
                      >
                        Reply
                      </button>
                      <span className="text-[#112032]">.</span>
                      <button type="button" className="hover:text-[#1890FF]">
                        Share
                      </button>
                      <span className="text-[#8C9AA9] font-normal ml-0.5">
                        {getRelativeTime(c.createdAt)}
                      </span>
                    </div>

                    {replyToId === c.id && (
                      <div className="flex items-center gap-3 rounded-full bg-[#F5F5F5] p-2 pr-4 mt-3 w-full">
                        <div className="shrink-0">
                          <FeedAvatar
                            name={currentUser.name}
                            seed={currentUser.avatarSeed}
                            image="/assets/images/txt_img.png"
                            size="xs"
                          />
                        </div>
                        <div className="relative min-w-0 flex-1 flex items-center">
                          <label htmlFor={`reply-${c.id}`} className="sr-only">
                            Write a comment
                          </label>
                          <input
                            type="text"
                            id={`reply-${c.id}`}
                            placeholder="Write a comment"
                            autoFocus
                            className="w-full bg-transparent text-[15.5px] text-[#112032] placeholder:text-[#517596] outline-none"
                          />
                        </div>
                        <div className="flex shrink-0 items-center gap-3 text-[#8C9AA9]">
                          <button
                            type="button"
                            className="hover:text-[#1890FF] transition-colors"
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
                              <rect
                                width="18"
                                height="18"
                                x="3"
                                y="3"
                                rx="4"
                                ry="4"
                              />
                              <circle cx="8.5" cy="8.5" r="1.5" />
                              <path d="M21 15l-5-5L5 21" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 rounded-full bg-[#F5F5F5] p-2 pr-4 w-full">
            <div className="shrink-0">
              <FeedAvatar
                name={currentUser.name}
                seed={currentUser.avatarSeed}
                image="/assets/images/txt_img.png"
                size="xs"
              />
            </div>
            <div className="relative min-w-0 flex-1 flex items-center">
              <label htmlFor={`comment-${post.id}`} className="sr-only">
                Write a comment
              </label>
              <input
                type="text"
                id={`comment-${post.id}`}
                placeholder="Write a comment"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isPosting}
                className="w-full bg-transparent text-[15.5px] text-[#112032] placeholder:text-[#517596] outline-none"
              />
            </div>
            <div className="flex shrink-0 items-center gap-3 text-[#8C9AA9]">
              <button
                type="button"
                className="hover:text-[#1890FF] transition-colors"
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
          </div>
        </div>
      )}
    </article>
  );
}
