import Image from "next/image";

type Props = {
  label: string;
  className?: string;
};

export function GoogleAuthButton({ label, className = "" }: Props) {
  return (
    <button
      type="button"
      className={`mb-8 flex w-full flex-nowrap items-center justify-center gap-3 rounded-md border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 transition hover:border-gray-300 hover:bg-gray-50 sm:px-8 ${className}`}
    >
      <Image
        src="/assets/images/google.svg"
        alt=""
        width={20}
        height={20}
        className="h-5 w-5 shrink-0"
      />
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}
