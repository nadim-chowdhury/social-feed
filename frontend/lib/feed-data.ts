export type ExploreItem = {
  id: string;
  label: string;
  href: string;
  badge?: "new";
};

export type SuggestedPerson = {
  id: string;
  name: string;
  title: string;
  avatarSeed: string;
  avatarImage: string;
};

export type EventCard = {
  id: string;
  day: string;
  month: string;
  title: string;
  goingCount: number;
  href: string;
};

export type StoryItem = {
  id: string;
  name: string;
  isOwn?: boolean;
  variant?: "active" | "inactive";
  avatarSeed: string;
};

export type PostComment = {
  id: string;
  author: string;
  authorSeed: string;
  body: string;
  reactions: number;
  timeLabel: string;
};

export type FeedPost = {
  id: string;
  author: string;
  authorSeed: string;
  timeLabel: string;
  visibility: string;
  title: string;
  imageGradient: string;
  reactSummary: string;
  commentCount: number;
  shareCount: number;
  reactionLabel: string;
  comments: PostComment[];
  previousCommentsCount?: number;
};

export type NotificationTimeline = {
  id: string;
  kind: "timeline";
  actor: string;
  avatarSeed: string;
  avatarImage: string;
  time: string;
};

export type NotificationGroup = {
  id: string;
  kind: "group_rename";
  groupName: string;
  avatarSeed: string;
  avatarImage: string;
  time: string;
};

export type NotificationEntry = NotificationTimeline | NotificationGroup;

export type OnlineFriend = {
  id: string;
  name: string;
  title: string;
  avatarSeed: string;
  status: "online" | "away";
  awayLabel?: string;
};

export type MightLikePerson = {
  id: string;
  name: string;
  title: string;
  avatarSeed: string;
  isFollowing?: boolean;
};

export const currentUser = {
  name: "Dylan Field",
  avatarSeed: "dylan",
  avatarImage: "/assets/images/profile.png",
};

export const exploreItems: ExploreItem[] = [
  { id: "1", label: "Learning", href: "#", badge: "new" },
  { id: "2", label: "Insights", href: "#" },
  { id: "3", label: "Find friends", href: "#" },
  { id: "4", label: "Bookmarks", href: "#" },
  { id: "5", label: "Group", href: "#" },
  { id: "6", label: "Gaming", href: "#", badge: "new" },
  { id: "7", label: "Settings", href: "#" },
  { id: "8", label: "Save post", href: "#" },
];

export const suggestedPeople: SuggestedPerson[] = [
  { id: "1", name: "Steve Jobs", title: "CEO of Apple", avatarImage: "/assets/images/profile.png", avatarSeed: "sj" },
  { id: "2", name: "Ryan Roslansky", title: "CEO of Linkedin", avatarImage: "/assets/images/profile.png", avatarSeed: "rr" },
  { id: "3", name: "Dylan Field", title: "CEO of Figma", avatarImage: "/assets/images/profile.png", avatarSeed: "df" },
];

export const events: EventCard[] = [
  {
    id: "e1",
    day: "10",
    month: "Jul",
    title: "No more terrorism no more cry",
    goingCount: 17,
    href: "#",
  },
  {
    id: "e2",
    day: "10",
    month: "Jul",
    title: "No more terrorism no more cry",
    goingCount: 17,
    href: "#",
  },
];

export const stories: StoryItem[] = [
  { id: "s0", name: "Your Story", isOwn: true, avatarSeed: "me" },
  { id: "s1", name: "Ryan Roslansky", variant: "active", avatarSeed: "rr" },
  { id: "s2", name: "Ryan Roslansky", variant: "inactive", avatarSeed: "rr2" },
  { id: "s3", name: "Ryan Roslansky", variant: "active", avatarSeed: "rr3" },
];

export const feedPosts: FeedPost[] = [
  {
    id: "p1",
    author: "Karim Saif",
    authorSeed: "ks",
    timeLabel: "5 minute ago",
    visibility: "Public",
    title: "-Healthy Tracking App",
    imageGradient: "from-sky-400 via-indigo-400 to-fuchsia-400",
    reactSummary: "9+",
    commentCount: 12,
    shareCount: 122,
    reactionLabel: "Haha",
    previousCommentsCount: 4,
    comments: [
      {
        id: "c1",
        author: "Radovan SkillArena",
        authorSeed: "rs",
        body:
          "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
        reactions: 198,
        timeLabel: "21m",
      },
    ],
  },
  {
    id: "p2",
    author: "Karim Saif",
    authorSeed: "ks2",
    timeLabel: "1 hour ago",
    visibility: "Friends",
    title: "Design systems workshop notes",
    imageGradient: "from-amber-300 via-orange-400 to-rose-500",
    reactSummary: "24",
    commentCount: 3,
    shareCount: 8,
    reactionLabel: "Like",
    comments: [],
  },
];

export const notifications: NotificationEntry[] = [
  {
    id: "n1",
    kind: "timeline",
    actor: "Steve Jobs",
    avatarSeed: "sj",
    avatarImage: "/assets/images/profile.png",
    time: "42 minutes ago",
  },
  {
    id: "n2",
    kind: "group_rename",
    groupName: "Freelacer usa",
    avatarSeed: "ad",
    avatarImage: "/assets/images/profile.png",
    time: "42 minutes ago",
  },
];

export const rightSidebarFriends: OnlineFriend[] = [
  { id: "f1", name: "Steve Jobs", title: "CEO of Apple", avatarSeed: "sj", status: "away", awayLabel: "5 minute ago" },
  { id: "f2", name: "Ryan Roslansky", title: "CEO of Linkedin", avatarSeed: "rr", status: "online" },
  { id: "f3", name: "Dylan Field", title: "CEO of Figma", avatarSeed: "df", status: "online" },
  { id: "f4", name: "Steve Jobs", title: "CEO of Apple", avatarSeed: "sj2", status: "away", awayLabel: "5 minute ago" },
  { id: "f5", name: "Ryan Roslansky", title: "CEO of Linkedin", avatarSeed: "rr2", status: "online" },
  { id: "f6", name: "Dylan Field", title: "CEO of Figma", avatarSeed: "df2", status: "online" },
];

export const rightSidebarMightLike: MightLikePerson[] = [
  {
    id: "m1",
    name: "Radovan SkillArena",
    title: "Founder & CEO at Trophy",
    avatarSeed: "rs",
    isFollowing: true,
  },
];
