"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { FeedPost } from "@/lib/feed-data";
import { currentUser } from "@/lib/feed-data";
import { FeedAvatar } from "./FeedAvatar";

export function FeedPostCard({ post }: { post: FeedPost }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <article className="mb-4 overflow-hidden rounded-md bg-white shadow-sm">
      <div className="border-b border-black/5 px-6 pb-4 pt-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 gap-3">
            <FeedAvatar name={post.author} seed={post.authorSeed} size="lg" />
            <div className="min-w-0">
              <h4 className="font-medium text-[#112032] mb-1">{post.author}</h4>
              <p className="text-sm text-[#666]">
                {post.timeLabel} ·{" "}
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
        <h3 className="mt-4 text-base text-[#112032]">
          {post.title}
        </h3>
        <div
          className={`mt-4 aspect-video w-full rounded-md bg-linear-to-br ${post.imageGradient}`}
          role="img"
          aria-label=""
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 px-6 py-4">
        <div className="flex items-center">
          <span className="flex -space-x-[10px]">
            {[
              "/assets/images/react_img1.png",
              "/assets/images/react_img2.png",
              "/assets/images/react_img3.png",
              "/assets/images/react_img4.png",
            ].map((img, i) => (
              <Image
                key={i}
                src={img}
                alt="user"
                width={36}
                height={36}
                className="h-9 w-9 rounded-full border-2 border-white object-cover"
              />
            ))}
            <span
              className="relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#1890FF] text-[13px] text-white"
            >
              9+
            </span>
          </span>
        </div>
        <div className="flex gap-4 text-[15px] text-[#666]">
          <button type="button" className="hover:text-[#1890FF]">
            <span className="text-[#112032]">
              {post.commentCount}
            </span>{" "}
            Comment
          </button>
          <p>
            <span className="text-[#112032]">
              {post.shareCount}
            </span>{" "}
            Share
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 border-b border-black/5 px-4 py-2 sm:px-6">
        <button
          type="button"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-[#F8F9FB] px-3 py-2 text-sm font-medium text-[#112032] sm:flex-none sm:bg-transparent"
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
          {post.reactionLabel}
        </button>
        <button
          type="button"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-[#112032] hover:bg-[#F8F9FB] sm:flex-none"
        >
          <svg
            className="text-[#112032]"
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="21"
            fill="none"
            viewBox="0 0 21 21"
            aria-hidden
          >
            <path
              stroke="currentColor"
              d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1v0c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5v0z"
            />
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.938 9.313h7.125M10.5 14.063h3.563"
            />
          </svg>
          Comment
        </button>
        <button
          type="button"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-[#112032] hover:bg-[#F8F9FB] sm:flex-none"
        >
          <svg
            className="text-[#112032]"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="21"
            fill="none"
            viewBox="0 0 24 21"
            aria-hidden
          >
            <path
              stroke="currentColor"
              strokeLinejoin="round"
              d="M23 10.5L12.917 1v5.429C3.267 6.429 1 13.258 1 20c2.785-3.52 5.248-5.429 11.917-5.429V20L23 10.5z"
            />
          </svg>
          Share
        </button>
      </div>

      <div className="px-6 py-4">
        <div className="flex gap-3">
          <FeedAvatar
            name={currentUser.name}
            seed={currentUser.avatarSeed}
            size="md"
          />
          <div className="relative min-w-0 flex-1">
            <label htmlFor={`comment-${post.id}`} className="sr-only">
              Write a comment
            </label>
            <textarea
              id={`comment-${post.id}`}
              rows={2}
              placeholder="Write a comment"
              className="w-full resize-none rounded-full border border-black/10 bg-[#F8F9FB] px-4 py-2.5 text-sm text-[#112032] placeholder:text-[#666] outline-none focus:border-[#1890FF]/40 focus:ring-2 focus:ring-[#1890FF]/20"
            />
            <div className="pointer-events-none absolute right-3 top-2.5 flex gap-2 text-[#112032]/50">
              <span className="pointer-events-auto">
                <button
                  type="button"
                  className="rounded p-1 hover:bg-black/5"
                  aria-label="Attach"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="none"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill="currentColor"
                      fillOpacity="0.46"
                      fillRule="evenodd"
                      d="M13.167 6.534a.5.5 0 01.5.5c0 3.061-2.35 5.582-5.333 5.837V14.5a.5.5 0 01-1 0v-1.629C4.35 12.616 2 10.096 2 7.034a.5.5 0 011 0c0 2.679 2.168 4.859 4.833 4.859 2.666 0 4.834-2.18 4.834-4.86a.5.5 0 01.5-.5zM7.833.667a3.218 3.218 0 013.208 3.22v3.126c0 1.775-1.439 3.22-3.208 3.22a3.218 3.218 0 01-3.208-3.22V3.887c0-1.776 1.44-3.22 3.208-3.22z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </span>
            </div>
          </div>
        </div>

        {post.previousCommentsCount != null &&
          post.previousCommentsCount > 0 && (
            <button
              type="button"
              className="mt-4 text-sm font-medium text-[#666] hover:text-[#1890FF]"
            >
              View {post.previousCommentsCount} previous comments
            </button>
          )}

        {post.comments.map((c) => (
          <div key={c.id} className="mt-4 flex gap-3">
            <Link href="#" className="shrink-0">
              <FeedAvatar name={c.author} seed={c.authorSeed} size="md" />
            </Link>
            <div className="min-w-0 flex-1 rounded-2xl bg-[#F8F9FB] px-4 py-3">
              <Link
                href="#"
                className="font-semibold text-[#112032] hover:underline"
              >
                {c.author}
              </Link>
              <p className="mt-1 text-sm leading-relaxed text-[#112032]">
                {c.body}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-[#666]">
                <span className="inline-flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden
                  >
                    <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                  </svg>
                  <span className="font-medium text-[#112032]">
                    {c.reactions}
                  </span>
                </span>
                <span className="flex gap-2">
                  <button type="button" className="hover:text-[#1890FF]">
                    Like
                  </button>
                  <span>·</span>
                  <button type="button" className="hover:text-[#1890FF]">
                    Reply
                  </button>
                  <span>·</span>
                  <button type="button" className="hover:text-[#1890FF]">
                    Share
                  </button>
                  <span>·</span>
                  <span className="text-[#999]">.{c.timeLabel}</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
