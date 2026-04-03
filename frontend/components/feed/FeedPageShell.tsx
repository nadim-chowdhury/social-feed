import { feedPosts } from "@/lib/feed-data";
import { FeedComposer } from "./FeedComposer";
import { FeedHeader } from "./FeedHeader";
import { FeedLeftSidebar } from "./FeedLeftSidebar";
import { FeedMobileNav } from "./FeedMobileNav";
import { FeedPostCard } from "./FeedPostCard";
import { FeedRightSidebar } from "./FeedRightSidebar";
import { FeedStories } from "./FeedStories";
import { FeedThemeToggle } from "./FeedThemeToggle";

export function FeedPageShell() {
  return (
    <>
      <FeedHeader />
      {/* <FeedThemeToggle /> */}

      <main className="mx-auto max-w-[1320px] px-4 pb-24 pt-4 lg:px-6 lg:pb-10 lg:pt-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <FeedLeftSidebar />
          </div>
          <div className="lg:col-span-6">
            <FeedStories />
            <FeedComposer />
            {feedPosts.map((post) => (
              <FeedPostCard key={post.id} post={post} />
            ))}
          </div>
          <div className="hidden lg:col-span-3 lg:block">
            <FeedRightSidebar />
          </div>
        </div>
      </main>

      <FeedMobileNav />
    </>
  );
}
