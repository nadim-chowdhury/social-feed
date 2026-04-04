"use client";

import {
  useCreatePostCommentMutation,
  useGetCommentRepliesQuery,
  useToggleCommentLikeMutation,
} from "@/services/postsApi";
import { ApiComment, CommentThreadProps } from "@/types/feed";
import Link from "next/link";
import { FeedAvatar } from "./FeedAvatar";
import { useEffect, useState } from "react";
import { getRelativeTime } from "@/lib/time";

export function CommentThread({
  post,
  comment,
  isActiveComposer,
  onRequestComposer,
  onReleaseComposer,
}: CommentThreadProps) {
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [isRepliesExpanded, setIsRepliesExpanded] = useState<boolean>(false);

  const [toggleCommentLike] = useToggleCommentLikeMutation();
  const { data: repliesResponse } = useGetCommentRepliesQuery(
    { postId: post.id, commentId: comment.id },
    { skip: comment.replyCount === 0 && !isActiveComposer },
  );

  useEffect(() => {
    if (isActiveComposer) {
      setIsRepliesExpanded(true);
    }
  }, [isActiveComposer]);

  return (
    <div key={comment.id} className="flex gap-3">
      <Link href="#" className="shrink-0 mt-1">
        <FeedAvatar
          name={comment.author.firstName + " " + comment.author.lastName}
          seed={comment.author.avatar || ""}
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
            {comment.author.firstName + " " + comment.author.lastName}
          </Link>
          <p className="mt-1 text-[15.5px] leading-relaxed text-[#516170]">
            {comment.content}
          </p>

          {comment.likesCount > 0 && (
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
              {comment.likesCount > 0 ? `${comment.likesCount}` : ""}&nbsp;
            </span>
          )}
        </div>

        <div className="mt-3 px-1 flex gap-1.5 text-[14.5px] font-medium text-[#112032] mb-4">
          <button
            type="button"
            className={`transition-colors hover:text-[#1890FF] ${
              comment.isLikedByMe ? "text-[#1890FF] font-bold" : "" // Active State styling
            }`}
            onClick={() =>
              toggleCommentLike({
                postId: post.id,
                commentId: comment.id,
              })
            }
          >
            Like
          </button>
          <span className="text-[#112032]">.</span>
          <button
            type="button"
            className="hover:text-[#1890FF]"
            onClick={() => {
              onRequestComposer({
                targetId: comment.id,
                authorName: `${comment.author.firstName} ${comment.author.lastName}`,
              });
            }}
          >
            Reply
          </button>
          <span className="text-[#112032]">.</span>
          <button type="button" className="hover:text-[#1890FF]">
            Share
          </button>
          <span className="text-[#8C9AA9] font-normal ml-0.5">
            {getRelativeTime(comment.createdAt)}
          </span>
        </div>

        {/* Replies Section */}
        {isRepliesExpanded &&
          repliesResponse?.data.map((reply) => (
            <div key={reply.id} className="flex w-[95%] gap-3">
              <Link href="#" className="shrink-0 mt-1">
                <FeedAvatar
                  name={reply.author.firstName + " " + reply.author.lastName}
                  seed={reply.author.avatar || ""}
                  image="/assets/images/txt_img.png"
                  size="xs"
                />
              </Link>

              <div className="min-w-0 flex-1 flex flex-col items-start w-full">
                <div className="relative w-full rounded-2xl bg-[#F5F5F5] px-4 py-3 pb-4">
                  <Link
                    href="#"
                    className="font-medium text-[15px] text-[#112032] hover:underline capitalize"
                  >
                    {reply.author.firstName + " " + reply.author.lastName}
                  </Link>
                  <p className="mt-1 text-[15.5px] leading-relaxed text-[#516170]">
                    {reply.content}
                  </p>

                  {reply.likesCount > 0 && (
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
                      {reply.likesCount > 0 ? `${reply.likesCount}` : ""}
                      &nbsp;
                    </span>
                  )}
                </div>

                <div className="mt-3 px-1 flex gap-1.5 text-[14.5px] font-medium text-[#112032] mb-2">
                  <button
                    type="button"
                    className={`transition-colors hover:text-[#1890FF] ${
                      reply.isLikedByMe ? "text-[#1890FF] font-bold" : ""
                    }`}
                    onClick={() =>
                      toggleCommentLike({
                        postId: post.id,
                        commentId: reply.id,
                        parentId: comment.id,
                      })
                    }
                  >
                    Like
                  </button>
                  <span className="text-[#112032]">.</span>
                  <button
                    type="button"
                    className="hover:text-[#1890FF]"
                    onClick={() => {
                      setReplyToId(replyToId === reply.id ? null : reply.id);
                    }}
                  >
                    Reply
                  </button>
                  <span className="text-[#112032]">.</span>
                  <button type="button" className="hover:text-[#1890FF]">
                    Share
                  </button>
                  <span className="text-[#8C9AA9] font-normal ml-0.5">
                    {getRelativeTime(reply.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
