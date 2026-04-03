export function deriveNamesFromEmail(email: string): {
  firstName: string;
  lastName: string;
} {
  const local = email.split("@")[0]?.trim() || "user";
  const segments = local.split(/[._-]+/).filter(Boolean);
  if (segments.length >= 2) {
    return {
      firstName: segments[0]!.slice(0, 50),
      lastName: segments.slice(1).join(" ").slice(0, 50),
    };
  }
  return {
    firstName: local.slice(0, 50),
    lastName: "User",
  };
}
