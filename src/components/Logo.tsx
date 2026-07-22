import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface LogoProps {
  className?: string;
  variant?: "default" | "light";
}

export function Logo({ className, variant = "default" }: LogoProps) {
  const textColor =
    variant === "light" ? "text-white" : "text-[hsl(var(--brand))]";

  return (
    <Link
      href="/"
      aria-label="Curalia — inicio"
      className={cn("inline-flex items-center gap-2.5", className)}
    >
      <Image
        src="/logo.png"
        alt=""
        width={50}
        height={50}
        className="object-contain"
      />
      <Image
        src="/title.png"
        alt=""
        width={120}
        height={50}
        className="object-contain"
      />
    </Link>
  );
}
