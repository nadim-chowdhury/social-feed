import Link from "next/link";
import { events, exploreItems, suggestedPeople } from "@/lib/feed-data";
import { ExploreIconForItem } from "./feed-explore-icons";
import { FeedAvatar } from "./FeedAvatar";
import Image from "next/image";

export function FeedLeftSidebar() {
  return (
    <aside className="space-y-4">
      <div className="rounded-md bg-card p-6 shadow-sm">
        <h4 className="mb-6 text-lg font-semibold text-fg">Explore</h4>
        <ul className="space-y-1">
          {exploreItems.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className="flex items-center justify-between gap-2 rounded-md py-2 text-sm font-medium text-fg hover:bg-border hover:text-primary"
              >
                <span className="flex min-w-0 items-center justify-center gap-4">
                  <span className="text-fg">
                    <ExploreIconForItem
                      id={item.id}
                      className="h-5 w-5 shrink-0"
                    />
                  </span>
                  <span className="truncate">{item.label}</span>
                </span>
                {item.badge === "new" && (
                  <span className="shrink-0 rounded bg-[#0ACF83] px-2 py-0.5 text-xs font-medium text-white">
                    New
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-md bg-card p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between gap-2">
          <h4 className="text-lg font-semibold text-fg">
            Suggested People
          </h4>
          <Link
            href="#"
            className="text-sm font-medium text-primary hover:underline"
          >
            See All
          </Link>
        </div>
        <div className="space-y-4">
          {suggestedPeople.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Link href="#" className="shrink-0">
                  <FeedAvatar
                    name={p.name}
                    image={p.avatarImage}
                    seed={p.avatarSeed}
                    size="sm"
                  />
                </Link>
                <div className="min-w-0">
                  <Link
                    href="#"
                    className="block truncate font-medium text-fg hover:text-primary"
                  >
                    {p.name}
                  </Link>
                  <p className="truncate text-xs text-fg">{p.title}</p>
                </div>
              </div>
              <Link
                href="#"
                className="shrink-0 rounded-md border border-border px-2 py-1 text-xs font-medium text-fg hover:bg-primary hover:border-primary hover:text-white transition-all duration-200 ease-in-out"
              >
                Connect
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-md bg-card p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between gap-2">
          <h4 className="text-lg font-semibold text-fg">Events</h4>
          <Link
            href="#"
            className="text-sm font-medium text-primary hover:underline"
          >
            See all
          </Link>
        </div>
        <div className="space-y-4">
          {events.map((ev) => (
            <Link
              key={ev.id}
              href={ev.href}
              className="block overflow-hidden rounded-md border border-border"
            >
              <Image
                src="/assets/images/feed_event1.png"
                alt="Event"
                width={280}
                height={280}
                className="w-full h-40 object-cover"
              />

              <div className="flex gap-3 p-3 py-5">
                <div className="flex h-14 w-10 shrink-0 flex-col items-center justify-center rounded-sm bg-[#0ACF83] text-center">
                  <p className="text-lg font-bold leading-none text-white">
                    {ev.day}
                  </p>
                  <p className="text-sm font-medium text-white/90">
                    {ev.month}
                  </p>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="line-clamp-2 text-sm font-semibold text-fg">
                    {ev.title}
                  </h4>
                </div>
              </div>
              <hr className="border-border" />
              <div className="flex items-center justify-between px-3 py-4 text-sm">
                <p className="text-fg">{ev.goingCount} People Going</p>
                <button className="font-medium text-primary border border-primary px-4 py-[2px] bg-primary/10 hover:bg-primary hover:text-white transition-all duration-300 ease-in-out">
                  Going
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
