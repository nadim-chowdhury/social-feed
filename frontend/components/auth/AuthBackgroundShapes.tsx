import Image from "next/image";

/**
 * Decorative background from docs/login.html — shape stacks with optional dark SVGs (hidden in light UI, matching original main.css).
 */
export function AuthBackgroundShapes() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 max-lg:hidden"
      aria-hidden
    >
      <div className="absolute left-0 top-0 -z-[1] max-[1199px]:w-[150px]">
        <Image
          src="/assets/images/shape1.svg"
          alt=""
          width={176}
          height={540}
          className="block h-auto w-auto max-[1199px]:w-full"
        />
        <Image
          src="/assets/images/dark_shape.svg"
          alt=""
          width={176}
          height={540}
          className="hidden h-auto w-auto"
        />
      </div>
      <div className="absolute right-[20px] top-0 -z-[1]">
        <Image
          src="/assets/images/shape2.svg"
          alt=""
          width={500}
          height={400}
          className="block h-auto w-auto max-[1199px]:max-w-[450px]"
        />
        <Image
          src="/assets/images/dark_shape1.svg"
          alt=""
          width={500}
          height={400}
          className="hidden h-auto w-full opacity-[0.05]"
        />
      </div>
      <div className="absolute bottom-0 right-[327px] -z-[1] w-[494px] min-[1200px]:max-[1499px]:right-0 min-[1500px]:max-[1700px]:right-[226px] min-[1500px]:max-[1700px]:w-[400px]">
        <Image
          src="/assets/images/shape3.svg"
          alt=""
          width={494}
          height={350}
          className="block h-auto w-full"
        />
        <Image
          src="/assets/images/dark_shape2.svg"
          alt=""
          width={494}
          height={350}
          className="hidden h-auto w-full opacity-[0.05]"
        />
      </div>
    </div>
  );
}
