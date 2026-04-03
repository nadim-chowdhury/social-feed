import Link from "next/link";
import { FeedAvatar } from "./FeedAvatar";
import { rightSidebarFriends, rightSidebarMightLike } from "@/lib/feed-data";

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function StatusIndicator({
  online,
  awayLabel,
}: {
  online: boolean;
  awayLabel?: string;
}) {
  if (online) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        fill="none"
        viewBox="0 0 14 14"
        aria-hidden
      >
        <rect
          width="12"
          height="12"
          x="1"
          y="1"
          fill="#0ACF83"
          stroke="#fff"
          strokeWidth="2"
          rx="6"
        />
      </svg>
    );
  }

  return (
    <span className="text-sm leading-none text-[#666]">
      {awayLabel ?? "5 minute ago"}
    </span>
  );
}

export function FeedRightSidebar() {
  return (
    <aside className="space-y-4">
      <div className="rounded-md bg-white px-6 pt-6 pb-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-[#112032]">You Might Like</h4>
          <Link href="#" className="text-sm font-medium text-[#1890FF] hover:underline">
            See All
          </Link>
        </div>

        <hr className="my-4 border-black/10" />

        <div className="space-y-4">
          {rightSidebarMightLike.map((p) => (
            <div
              key={p.id}
              className="flex flex-col items-center justify-center gap-3"
            >
              <div className="flex min-w-0 items-center gap-3 py-3">
                <Link href="#" className="shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F2F2F2] text-sm font-semibold text-[#112032]">
                    {initialsFromName(p.name)}
                  </div>
                </Link>

                <div className="min-w-0">
                  <Link
                    href="#"
                    className="block truncate font-semibold text-[#112032] hover:text-[#1890FF] mb-1"
                  >
                    {p.name}
                  </Link>
                  <p className="truncate text-sm font-medium text-[#1890FF]">{p.title}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="h-10 min-w-[110px] rounded-md border border-black/10 bg-transparent text-sm font-medium text-[#9CA3AF] hover:bg-[#F8F9FB]"
                >
                  Ignore
                </button>
                <button
                  type="button"
                  className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                    p.isFollowing
                      ? "h-10 min-w-[110px] bg-[#377DFF] text-white hover:bg-[#2f6ee8]"
                      : "h-10 min-w-[110px] border border-[#377DFF] bg-transparent text-[#377DFF] hover:bg-[#E6F7FF]"
                  }`}
                >
                  Follow
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-md bg-white px-6 pt-6 pb-3">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-[#112032]">Your Friends</h4>
          <Link href="#" className="text-sm font-medium text-[#1890FF] hover:underline">
            See All
          </Link>
        </div>

        <form
          className="mt-4 flex items-center gap-2 rounded-md border border-black/5 bg-[#F8F9FB] px-3 py-2"
        >
          <svg
            className="h-[17px] w-[17px] shrink-0 text-[#666]"
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="17"
            fill="none"
            viewBox="0 0 17 17"
            aria-hidden
          >
            <circle cx="7" cy="7" r="6" stroke="#666" />
            <path stroke="#666" strokeLinecap="round" d="M16 16l-3-3" />
          </svg>
          <input
            type="search"
            placeholder="input search text"
            aria-label="Search"
            className="w-full bg-transparent text-sm outline-none"
          />
        </form>

        <div className="mt-4 max-h-[560px] overflow-y-auto pr-1">
          <div className="space-y-4">
            {rightSidebarFriends.map((f) => {
              const inactive = f.status === "away";
              return (
                <div
                  key={f.id}
                  className={`flex items-center justify-between gap-3 ${
                    inactive ? "opacity-80" : ""
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="shrink-0">
                      <Link href="#">
                        <FeedAvatar name={f.name} seed={f.avatarSeed} size="md" />
                      </Link>
                    </div>
                    <div className="min-w-0">
                      <Link href="#" className="block truncate font-semibold text-[#112032] hover:text-[#1890FF]">
                        {f.name}
                      </Link>
                      <p className="truncate text-sm text-[#666]">{f.title}</p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <StatusIndicator
                      online={f.status === "online"}
                      awayLabel={f.awayLabel}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
