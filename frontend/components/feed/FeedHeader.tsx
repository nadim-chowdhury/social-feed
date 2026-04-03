"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  currentUser,
  notifications,
  type NotificationEntry,
} from "@/lib/feed-data";
import { FeedAvatar } from "./FeedAvatar";

function NotificationText({ n }: { n: NotificationEntry }) {
  if (n.kind === "timeline") {
    return (
      <p className="text-sm leading-snug text-[#112032]">
        <span className="font-medium">{n.actor}</span> posted a link in your timeline.
      </p>
    );
  }
  return (
    <p className="text-sm leading-snug text-[#112032]">
      An admin changed the name of the group{" "}
      <span className="font-medium text-[#1890FF]">{n.groupName}</span> to{" "}
      <span className="font-medium text-[#1890FF]">{n.groupName}</span>
    </p>
  );
}

export function FeedHeader() {
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifyMenuOpen, setNotifyMenuOpen] = useState(false);
  const notifyRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      const t = e.target as Node;
      if (notifyRef.current && !notifyRef.current.contains(t)) setNotifyOpen(false);
      if (profileRef.current && !profileRef.current.contains(t)) {
        setProfileOpen(false);
        setNotifyMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <header className="fixed left-0 right-0 top-0 z-40 border-b border-black/5 bg-white">
      <nav className="mx-auto hidden max-w-[1320px] items-center gap-4 px-4 py-2.5 md:flex lg:px-6" aria-label="Main">
        <div className="flex w-full items-center gap-8">
          <Link href="/feed" className="shrink-0">
            <Image src="/assets/images/logo.svg" alt="Buddy Script" width={120} height={32} className="h-8 w-auto" />
          </Link>

          <div className="min-w-0 flex-1">
            <form className="relative mx-auto max-w-md" onSubmit={(e) => e.preventDefault()}>
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-[#666]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 17"
                aria-hidden
              >
                <circle cx="7" cy="7" r="6" stroke="currentColor" />
                <path stroke="currentColor" strokeLinecap="round" d="M16 16l-3-3" />
              </svg>
              <input
                type="search"
                placeholder="input search text"
                className="w-full rounded-full bg-[#F8F9FB] h-10 py-2 pl-10 pr-3 text-sm text-[#112032] placeholder:text-[#666] outline-none focus:border-[#1890FF]/80 focus:ring-1 focus:ring-[#1890FF]/80"
                aria-label="Search"
              />
            </form>
          </div>

          <ul className="ml-auto flex items-center gap-1 sm:gap-4">
            <li>
              <Link
                href="/feed"
                className="flex h-11 w-11 items-center justify-center rounded-md text-[#112032]/70 hover:bg-black/5"
                aria-current="page"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="21" fill="none" viewBox="0 0 18 21" aria-hidden>
                  <path
                    stroke="#000"
                    strokeWidth="1.5"
                    strokeOpacity="0.6"
                    d="M1 9.924c0-1.552 0-2.328.314-3.01.313-.682.902-1.187 2.08-2.196l1.143-.98C6.667 1.913 7.732 1 9 1c1.268 0 2.333.913 4.463 2.738l1.142.98c1.179 1.01 1.768 1.514 2.081 2.196.314.682.314 1.458.314 3.01v4.846c0 2.155 0 3.233-.67 3.902-.669.67-1.746.67-3.901.67H5.57c-2.155 0-3.232 0-3.902-.67C1 18.002 1 16.925 1 14.77V9.924z"
                  />
                  <path
                    stroke="#000"
                    strokeOpacity="0.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M11.857 19.341v-5.857a1 1 0 00-1-1H7.143a1 1 0 00-1 1v5.857"
                  />
                </svg>
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="flex h-11 w-11 items-center justify-center rounded-md text-[#112032]/70 hover:bg-black/5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="20" fill="none" viewBox="0 0 26 20" aria-hidden>
                  <path
                    fill="currentColor"
                    fillOpacity="0.6"
                    fillRule="evenodd"
                    d="M12.79 12.15h.429c2.268.015 7.45.243 7.45 3.732 0 3.466-5.002 3.692-7.415 3.707h-.894c-2.268-.015-7.452-.243-7.452-3.727 0-3.47 5.184-3.697 7.452-3.711l.297-.001h.132zm0 1.75c-2.792 0-6.12.34-6.12 1.962 0 1.585 3.13 1.955 5.864 1.976l.255.002c2.792 0 6.118-.34 6.118-1.958 0-1.638-3.326-1.982-6.118-1.982zm9.343-2.224c2.846.424 3.444 1.751 3.444 2.79 0 .636-.251 1.794-1.931 2.43a.882.882 0 01-1.137-.506.873.873 0 01.51-1.13c.796-.3.796-.633.796-.793 0-.511-.654-.868-1.944-1.06a.878.878 0 01-.741-.996.886.886 0 011.003-.735zm-17.685.735a.878.878 0 01-.742.997c-1.29.19-1.944.548-1.944 1.059 0 .16 0 .491.798.793a.873.873 0 01-.314 1.693.897.897 0 01-.313-.057C.25 16.259 0 15.1 0 14.466c0-1.037.598-2.366 3.446-2.79.485-.06.929.257 1.002.735zM12.789 0c2.96 0 5.368 2.392 5.368 5.33 0 2.94-2.407 5.331-5.368 5.331h-.031a5.329 5.329 0 01-3.782-1.57 5.253 5.253 0 01-1.553-3.764C7.423 2.392 9.83 0 12.789 0zm0 1.75c-1.987 0-3.604 1.607-3.604 3.58a3.526 3.526 0 001.04 2.527 3.58 3.58 0 002.535 1.054l.03.875v-.875c1.987 0 3.605-1.605 3.605-3.58S14.777 1.75 12.789 1.75zm7.27-.607a4.222 4.222 0 013.566 4.172c-.004 2.094-1.58 3.89-3.665 4.181a.88.88 0 01-.994-.745.875.875 0 01.75-.989 2.494 2.494 0 002.147-2.45 2.473 2.473 0 00-2.09-2.443.876.876 0 01-.726-1.005.881.881 0 011.013-.721zm-13.528.72a.876.876 0 01-.726 1.006 2.474 2.474 0 00-2.09 2.446A2.493 2.493 0 005.86 7.762a.875.875 0 11-.243 1.734c-2.085-.29-3.66-2.087-3.664-4.179 0-2.082 1.5-3.837 3.566-4.174a.876.876 0 011.012.72z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </li>
            <li className="relative">
              <div className="relative" ref={notifyRef}>
              <button
                type="button"
                className="relative flex h-11 w-11 items-center justify-center rounded-md text-[#112032]/70 hover:bg-black/5"
                aria-expanded={notifyOpen}
                onClick={() => setNotifyOpen((v) => !v)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" fill="none" viewBox="0 0 20 22" aria-hidden>
                  <path
                    fill="currentColor"
                    fillOpacity="0.6"
                    fillRule="evenodd"
                    d="M7.547 19.55c.533.59 1.218.915 1.93.915.714 0 1.403-.324 1.938-.916a.777.777 0 011.09-.056c.318.284.344.77.058 1.084-.832.917-1.927 1.423-3.086 1.423h-.002c-1.155-.001-2.248-.506-3.077-1.424a.762.762 0 01.057-1.083.774.774 0 011.092.057zM9.527 0c4.58 0 7.657 3.543 7.657 6.85 0 1.702.436 2.424.899 3.19.457.754.976 1.612.976 3.233-.36 4.14-4.713 4.478-9.531 4.478-4.818 0-9.172-.337-9.528-4.413-.003-1.686.515-2.544.973-3.299l.161-.27c.398-.679.737-1.417.737-2.918C1.871 3.543 4.948 0 9.528 0zm0 1.535c-3.6 0-6.11 2.802-6.11 5.316 0 2.127-.595 3.11-1.12 3.978-.422.697-.755 1.247-.755 2.444.173 1.93 1.455 2.944 7.986 2.944 6.494 0 7.817-1.06 7.988-3.01-.003-1.13-.336-1.681-.757-2.378-.526-.868-1.12-1.851-1.12-3.978 0-2.514-2.51-5.316-6.111-5.316z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="absolute right-1 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#1890FF] px-1 text-[11px] font-semibold text-white">
                  6
                </span>
              </button>

              {notifyOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-[min(100vw-2rem,380px)] rounded-lg border border-black/10 bg-white shadow-lg">
                  <div className="flex items-start justify-between border-b border-black/5 px-4 py-3">
                    <h4 className="text-base font-semibold text-[#112032]">Notifications</h4>
                    <div className="relative">
                      <button
                        type="button"
                        className="rounded p-1 text-[#C4C4C4] hover:bg-black/5"
                        aria-expanded={notifyMenuOpen}
                        onClick={() => setNotifyMenuOpen((v) => !v)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="4" height="17" fill="none" viewBox="0 0 4 17">
                          <circle cx="2" cy="2" r="2" fill="currentColor" />
                          <circle cx="2" cy="8" r="2" fill="currentColor" />
                          <circle cx="2" cy="15" r="2" fill="currentColor" />
                        </svg>
                      </button>
                      {notifyMenuOpen && (
                        <ul className="absolute right-0 top-full z-10 mt-1 min-w-[180px] rounded-md border border-black/10 bg-white py-1 text-sm shadow-md">
                          <li>
                            <button type="button" className="block w-full px-3 py-2 text-left hover:bg-black/5">
                              Mark as all read
                            </button>
                          </li>
                          <li>
                            <button type="button" className="block w-full px-3 py-2 text-left hover:bg-black/5">
                              Notifications settings
                            </button>
                          </li>
                          <li>
                            <button type="button" className="block w-full px-3 py-2 text-left hover:bg-black/5">
                              Open Notifications
                            </button>
                          </li>
                        </ul>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 border-b border-black/5 px-4 py-2">
                    <button
                      type="button"
                      className="rounded-md bg-[#1890FF] px-3 py-1.5 text-sm font-medium text-white"
                    >
                      All
                    </button>
                    <button
                      type="button"
                      className="rounded-md px-3 py-1.5 text-sm font-medium text-[#666] hover:bg-black/5"
                    >
                      Unread
                    </button>
                  </div>
                  <div className="max-h-[min(60vh,420px)] overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className="flex gap-3 border-b border-black/5 px-4 py-3 last:border-b-0"
                      >
                        <FeedAvatar name={n.kind === "timeline" ? n.actor : "Admin"} image={n.avatarImage} seed={n.avatarSeed} size="sm" />
                        <div className="min-w-0 flex-1">
                          <NotificationText n={n} />
                          <p className="mt-1 text-xs text-[#666]">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              </div>
            </li>
            <li>
              <Link href="#" className="relative flex h-11 w-11 items-center justify-center rounded-md text-[#112032]/70 hover:bg-black/5">
                <svg xmlns="http://www.w3.org/2000/svg" width="23" height="22" fill="none" viewBox="0 0 23 22" aria-hidden>
                  <path
                    fill="currentColor"
                    fillOpacity="0.6"
                    fillRule="evenodd"
                    d="M11.43 0c2.96 0 5.743 1.143 7.833 3.22 4.32 4.29 4.32 11.271 0 15.562C17.145 20.886 14.293 22 11.405 22c-1.575 0-3.16-.33-4.643-1.012-.437-.174-.847-.338-1.14-.338-.338.002-.793.158-1.232.308-.9.307-2.022.69-2.852-.131-.826-.822-.445-1.932-.138-2.826.152-.44.307-.895.307-1.239 0-.282-.137-.642-.347-1.161C-.57 11.46.322 6.47 3.596 3.22A11.04 11.04 0 0111.43 0zm0 1.535A9.5 9.5 0 004.69 4.307a9.463 9.463 0 00-1.91 10.686c.241.592.474 1.17.474 1.77 0 .598-.207 1.201-.39 1.733-.15.439-.378 1.1-.231 1.245.143.147.813-.085 1.255-.235.53-.18 1.133-.387 1.73-.391.597 0 1.161.225 1.758.463 3.655 1.679 7.98.915 10.796-1.881 3.716-3.693 3.716-9.7 0-13.391a9.5 9.5 0 00-6.74-2.77zm4.068 8.867c.57 0 1.03.458 1.03 1.024 0 .566-.46 1.023-1.03 1.023a1.023 1.023 0 11-.01-2.047h.01zm-4.131 0c.568 0 1.03.458 1.03 1.024 0 .566-.462 1.023-1.03 1.023a1.03 1.03 0 01-1.035-1.024c0-.566.455-1.023 1.025-1.023h.01zm-4.132 0c.568 0 1.03.458 1.03 1.024 0 .566-.462 1.023-1.03 1.023a1.022 1.022 0 11-.01-2.047h.01z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="absolute right-1 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#1890FF] px-1 text-[11px] font-semibold text-white">
                  2
                </span>
              </Link>
            </li>
          </ul>

          <div className="relative hidden items-center gap-2 sm:flex" ref={profileRef}>
            <FeedAvatar name={currentUser.name} image={currentUser.avatarImage} seed={currentUser.avatarSeed} size="sm" />
            <div className="min-w-0 flex items-center gap-2">
              <p className="truncate text-sm font-medium text-[#112032]">{currentUser.name}</p>
              <button
                type="button"
                className="flex items-center gap-1 text-[#112032]"
                aria-expanded={profileOpen}
                onClick={() => setProfileOpen((v) => !v)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" fill="none" viewBox="0 0 10 6" aria-hidden>
                  <path fill="#112032" d="M5 5l.354.354L5 5.707l-.354-.353L5 5zm4.354-3.646l-4 4-.708-.708 4-4 .708.708zm-4.708 4l-4-4 .708-.708 4 4-.708.708z" />
                </svg>
              </button>
            </div>

            {profileOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-lg border border-black/10 bg-white py-2 shadow-lg">
                <div className="flex gap-3 px-4 pb-3">
                  <FeedAvatar name={currentUser.name} image={currentUser.avatarImage} seed={currentUser.avatarSeed} size="md" />
                  <div>
                    <p className="font-semibold text-[#112032]">{currentUser.name}</p>
                    <Link href="#" className="text-sm text-[#1890FF] hover:underline">
                      View Profile
                    </Link>
                  </div>
                </div>
                <hr className="border-black/5" />
                <ul className="py-1 text-sm">
                  <li>
                    <Link href="#" className="flex items-center justify-between px-4 py-2 hover:bg-black/5">
                      <span className="flex items-center gap-2 text-[#112032]">
                        <span className="text-[#377DFF]">Settings</span>
                      </span>
                      <span className="text-[#112032]/40">›</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="flex items-center justify-between px-4 py-2 hover:bg-black/5">
                      <span className="flex items-center gap-2">Help &amp; Support</span>
                      <span className="text-[#112032]/40">›</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="flex items-center justify-between px-4 py-2 hover:bg-black/5">
                      <span className="flex items-center gap-2">Log Out</span>
                      <span className="text-[#112032]/40">›</span>
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="mx-auto flex max-w-[1320px] items-center justify-between px-4 py-3 md:hidden">
        <Link href="/feed">
          <Image src="/assets/images/logo.svg" alt="" width={100} height={28} className="h-7 w-auto" />
        </Link>
        <Link href="#" className="rounded-full p-2 text-[#666] hover:bg-black/5" aria-label="Search">
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 17 17">
            <circle cx="7" cy="7" r="6" stroke="currentColor" />
            <path stroke="currentColor" strokeLinecap="round" d="M16 16l-3-3" />
          </svg>
        </Link>
      </div>
    </header>
  );
}
