import Link from "next/link";
import { rightSidebarFriends } from "@/lib/feed-data";
import { FeedAvatar } from "./FeedAvatar";

function StatusDot({ online, awayLabel }: { online: boolean; awayLabel?: string }) {
  if (online) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 14 14" aria-hidden>
        <rect width="12" height="12" x="1" y="1" fill="#0ACF83" stroke="#fff" strokeWidth="2" rx="6" />
      </svg>
    );
  }
  return <span className="text-xs text-[#999]">{awayLabel ?? "—"}</span>;
}

export function FeedRightSidebar() {
  return (
    <aside className="space-y-4">
      <div className="rounded-md bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between gap-2">
          <h4 className="text-lg font-semibold text-[#112032]">You might like</h4>
          <Link href="#" className="text-sm font-medium text-[#1890FF] hover:underline">
            See All
          </Link>
        </div>
        <div className="space-y-4">
          {rightSidebarFriends.slice(0, 3).map((f) => (
            <div key={f.id} className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Link href="#" className="shrink-0">
                  <FeedAvatar name={f.name} seed={f.avatarSeed} size="md" />
                </Link>
                <div className="min-w-0">
                  <Link href="#" className="block truncate font-semibold text-[#112032] hover:text-[#1890FF]">
                    {f.name}
                  </Link>
                  <p className="truncate text-sm text-[#666]">{f.title}</p>
                </div>
              </div>
              <div className="shrink-0">
                <StatusDot online={f.status === "online"} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-md bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between gap-2">
          <h4 className="text-lg font-semibold text-[#112032]">Friend</h4>
          <Link href="#" className="text-sm font-medium text-[#1890FF] hover:underline">
            See All
          </Link>
        </div>
        <div className="space-y-4">
          {rightSidebarFriends.map((f) => (
            <div
              key={f.id}
              className={`flex items-center justify-between gap-3 ${
                f.status === "away" ? "opacity-80" : ""
              }`}
            >
              <div className="flex min-w-0 items-center gap-3">
                <Link href="#" className="shrink-0">
                  <FeedAvatar name={f.name} seed={f.avatarSeed} size="md" />
                </Link>
                <div className="min-w-0">
                  <Link href="#" className="block truncate font-semibold text-[#112032] hover:text-[#1890FF]">
                    {f.name}
                  </Link>
                  <p className="truncate text-sm text-[#666]">{f.title}</p>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <StatusDot online={f.status === "online"} awayLabel={f.awayLabel} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
