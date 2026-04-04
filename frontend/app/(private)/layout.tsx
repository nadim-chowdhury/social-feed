import { cookies } from "next/headers";
import { AuthHydrator } from "@/components/auth/AuthHydrator";

export default async function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = (await cookies()).get("jwt_token")?.value || null;

  return (
    <div className="min-h-screen bg-[#F0F2F5] pt-14 md:pt-[72px]">
      <AuthHydrator token={token}>{children}</AuthHydrator>
    </div>
  );
}
