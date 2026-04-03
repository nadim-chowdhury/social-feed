import Image from "next/image";

function gradientForSeed(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1)
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const palettes = [
    "from-violet-400 to-fuchsia-600",
    "from-sky-400 to-indigo-600",
    "from-emerald-400 to-teal-600",
    "from-amber-400 to-orange-600",
    "from-rose-400 to-red-600",
    "from-blue-400 to-cyan-600",
  ];
  return palettes[h % palettes.length];
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

type FeedAvatarProps = {
  name: string;
  seed: string;
  image?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
};

const sizeClass: Record<NonNullable<FeedAvatarProps["size"]>, string> = {
  xs: "h-8 w-8 min-w-8 text-[10px]",
  sm: "h-10 w-10 min-w-10 text-xs",
  md: "h-12 w-12 min-w-12 text-sm",
  lg: "h-14 w-14 min-w-14 text-base",
  xl: "h-[52px] w-[52px] min-w-[52px] text-lg",
};

export function FeedAvatar({
  name,
  seed,
  image,
  size = "md",
  className = "",
}: FeedAvatarProps) {
  const g = gradientForSeed(seed);
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-linear-to-br font-semibold text-white shadow-inner ${g} ${sizeClass[size]} ${className}`}
      aria-hidden
    >
      {image ? (
        <Image
          src={image}
          alt={name}
          width={280}
          height={280}
          className="object-cover"
        />
      ) : (
        initialsFromName(name)
      )}
    </div>
  );
}
