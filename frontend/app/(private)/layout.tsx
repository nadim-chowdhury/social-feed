export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#F0F2F5] pt-14 md:pt-[72px]">{children}</div>
  );
}
