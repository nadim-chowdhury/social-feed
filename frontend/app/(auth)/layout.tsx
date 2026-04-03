import { AuthBackgroundShapes } from "@/components/auth/AuthBackgroundShapes";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="relative z-[1] min-h-screen overflow-hidden bg-[#F0F2F5] py-12 md:py-24">
      <AuthBackgroundShapes />
      <div className="relative z-10 mx-auto w-full max-w-[1320px] px-4 sm:px-6">
        {children}
      </div>
    </section>
  );
}
