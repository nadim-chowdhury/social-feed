export function OrDivider() {
  return (
    <div
      className="mb-8 flex w-full items-center gap-3"
      role="separator"
      aria-orientation="horizontal"
    >
      <div className="h-px min-w-0 flex-1 bg-gray-200" />
      <span className="shrink-0 bg-white px-2 text-sm text-gray-400">Or</span>
      <div className="h-px min-w-0 flex-1 bg-gray-200" />
    </div>
  );
}
