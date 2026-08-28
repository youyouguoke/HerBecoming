import Image from "next/image";

interface LogoProps {
  /** Variant: 'header' for nav, 'footer' for footer, 'hero' for homepage, 'icon' for favicon-sized */
  variant?: "header" | "footer" | "hero" | "icon";
  /** Override width (height auto-calculated) */
  width?: number;
  /** Override height (width auto-calculated) */
  height?: number;
  /** Additional CSS classes */
  className?: string;
  /** Alt text */
  alt?: string;
}

const LOGO_CONFIG = {
  header: { src: "/logo-header.png", height: 40, width: 134 },
  footer: { src: "/logo-footer.png", height: 32, width: 107 },
  hero: { src: "/logo-full.png", height: 120, width: 405 },
  icon: { src: "/favicon-48x48.png", height: 48, width: 40 },
} as const;

export function Logo({
  variant = "header",
  width,
  height,
  className = "",
  alt = "HerBecoming",
}: LogoProps) {
  const config = LOGO_CONFIG[variant];
  const finalWidth = width ?? config.width;
  const finalHeight = height ?? config.height;

  return (
    <Image
      src={config.src}
      alt={alt}
      width={finalWidth}
      height={finalHeight}
      priority={variant === "header" || variant === "hero"}
      className={`object-contain ${className}`}
    />
  );
}
