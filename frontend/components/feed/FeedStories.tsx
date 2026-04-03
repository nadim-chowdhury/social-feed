import Link from "next/link";
import { stories } from "@/lib/feed-data";
import { FeedAvatar } from "./FeedAvatar";

export function FeedStories() {
  return (
    <section className="mb-4 rounded-md">
      {/* Desktop grid */}
      <div className="relative hidden md:block">
        {/* <button
          type="button"
          className="absolute -left-1 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[#1890FF] shadow-md"
          aria-label="Previous stories"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="9" height="8" fill="none" viewBox="0 0 9 8" aria-hidden>
            <path fill="#fff" d="M8 4l.366-.341.318.341-.318.341L8 4zm-7 .5a.5.5 0 010-1v1zM5.566.659l2.8 3-.732.682-2.8-3L5.566.66zm2.8 3.682l-2.8 3-.732-.682 2.8-3 .732.682zM8 4.5H1v-1h7v1z" />
          </svg>
        </button> */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stories.map((s) => (
            <StoryCard key={s.id} story={s} />
          ))}
        </div>
      </div>

      {/* Mobile horizontal scroll */}
      <div className="mx-1 md:hidden">
        <ul className="flex gap-3 overflow-x-auto pb-1 pl-1 pr-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {stories.map((s) => (
            <li key={s.id} className="w-[72px] shrink-0">
              <MobileStory story={s} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function StoryCard({ story }: { story: (typeof stories)[number] }) {
  if (story.isOwn) {
    return (
      <div className="overflow-hidden rounded-md">
        <div
          className="relative aspect-3/4 rounded-md"
          style={{
            background: `url(${story.ownImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center pb-3 pt-8 z-50">
            <button
              type="button"
              className="mb-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#1890FF]"
              aria-label="Add story"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                fill="none"
                viewBox="0 0 10 10"
                aria-hidden
              >
                <path
                  stroke="#fff"
                  strokeLinecap="round"
                  d="M.5 4.884h9M4.884 9.5v-9"
                />
              </svg>
            </button>
            <p className="text-center text-xs font-medium text-white drop-shadow">
              Your Story
            </p>
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-20 w-full pb-6 pt-8 rounded-t-4xl bg-[#112032]" />

          <div className="absolute z-10 top-0 left-0 right-0 bottom-0 w-full h-full bg-black/50 hover:bg-black/70 transition-all duration-300" />
        </div>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-md`}>
      <div
        className="relative aspect-3/4 rounded-md overflow-hidden"
        style={{
          background: `url(${story.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute bottom-2 left-2 right-2">
          <p className="truncate text-xs font-medium text-white drop-shadow">
            {story.name}
          </p>
        </div>
        <div className="absolute right-2 top-2 z-50">
          <FeedAvatar
            name={story.name}
            seed={story.avatarSeed}
            image={story.avatarImage}
            size="xs"
            className="rounded-full ring-2 ring-white overflow-hidden"
          />
        </div>

        <div className="absolute z-10 top-0 left-0 right-0 bottom-0 w-full h-full bg-black/50 hover:bg-black/70 transition-all duration-300" />
      </div>
    </div>
  );
}

function MobileStory({ story }: { story: (typeof stories)[number] }) {
  if (story.isOwn) {
    return (
      <Link href="#" className="flex flex-col items-center">
        <div className="relative mb-1">
          <div className="h-[60px] w-[60px] overflow-hidden rounded-full">
            <img
              src={story.ownImage || story.image || "/assets/images/user1.png"}
              alt="Your Story"
              className="h-full w-full object-cover"
            />
          </div>
          <span className="absolute bottom-0 right-0 flex h-[22px] w-[22px] items-center justify-center rounded-full border-2px border-white bg-[#1890FF]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </span>
        </div>
        <p className="w-full text-center truncate text-[14px] font-medium text-[#1890FF] mt-0.5">
          Your Story
        </p>
      </Link>
    );
  }

  const active = story.variant === "active";
  const ringClass = active ? "border-[#1890FF]" : "border-[#C4C4C4]";

  return (
    <Link href="#" className="flex flex-col items-center">
      <div
        className={`relative mb-1 rounded-full border-2px p-[2.5px] ${ringClass}`}
      >
        <div className="h-[54px] w-[54px] overflow-hidden rounded-full">
          <img
            src={story.avatarImage || story.image || "/assets/images/user1.png"}
            alt={story.name}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
      <p className="w-full text-center truncate text-[14px] font-medium text-[#516170] mt-0.5">
        {story.name.length > 5 ? `${story.name.slice(0, 4)}...` : story.name}
      </p>
    </Link>
  );
}
