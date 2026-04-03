import Link from "next/link";
import { events, exploreItems, suggestedPeople } from "@/lib/feed-data";
import { ExploreIconForItem } from "./feed-explore-icons";
import { FeedAvatar } from "./FeedAvatar";

export function FeedLeftSidebar() {
  return (
    <aside className="space-y-4">
      <div className="rounded-md bg-white p-6 shadow-sm">
        <h4 className="mb-6 text-lg font-semibold text-[#112032]">Explore</h4>
        <ul className="space-y-1">
          {exploreItems.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className="flex items-center justify-between gap-2 rounded-md py-2 text-sm font-medium text-[#666] hover:bg-[#F8F9FB] hover:text-[#112032]"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span className="text-[#666]">
                    <ExploreIconForItem id={item.id} className="h-5 w-5 shrink-0" />
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

      <div className="rounded-md bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between gap-2">
          <h4 className="text-lg font-semibold text-[#112032]">Suggested People</h4>
          <Link href="#" className="text-sm font-medium text-[#1890FF] hover:underline">
            See All
          </Link>
        </div>
        <div className="space-y-4">
          {suggestedPeople.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Link href="#" className="shrink-0">
                  <FeedAvatar name={p.name} seed={p.avatarSeed} size="md" />
                </Link>
                <div className="min-w-0">
                  <Link href="#" className="block truncate font-semibold text-[#112032] hover:text-[#1890FF]">
                    {p.name}
                  </Link>
                  <p className="truncate text-sm text-[#666]">{p.title}</p>
                </div>
              </div>
              <Link
                href="#"
                className="shrink-0 rounded-md border border-[#1890FF] px-3 py-1.5 text-sm font-medium text-[#1890FF] hover:bg-[#E6F7FF]"
              >
                Connect
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-md bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between gap-2">
          <h4 className="text-lg font-semibold text-[#112032]">Events</h4>
          <Link href="#" className="text-sm font-medium text-[#1890FF] hover:underline">
            See all
          </Link>
        </div>
        <div className="space-y-4">
          {events.map((ev) => (
            <Link key={ev.id} href={ev.href} className="block overflow-hidden rounded-md border border-black/5">
              <div className="relative aspect-[21/9] bg-gradient-to-br from-slate-200 to-slate-400" />
              <div className="flex gap-3 p-3">
                <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-md bg-[#F8F9FB] text-center">
                  <p className="text-lg font-bold leading-none text-[#112032]">{ev.day}</p>
                  <p className="text-xs font-medium text-[#666]">{ev.month}</p>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="line-clamp-2 text-sm font-semibold text-[#112032]">{ev.title}</h4>
                </div>
              </div>
              <hr className="border-black/5" />
              <div className="flex items-center justify-between px-3 py-2 text-sm">
                <p className="text-[#666]">{ev.goingCount} People Going</p>
                <span className="font-medium text-[#1890FF]">Going</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
