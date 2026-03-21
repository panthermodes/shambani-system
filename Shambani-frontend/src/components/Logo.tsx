import logoImage from "../assets/logos/logo.png";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showText?: boolean;
}

const sizeMap: Record<NonNullable<LogoProps["size"]>, string> = {
  sm: "h-8",
  md: "h-12",
  lg: "h-16",
  xl: "h-24",
};

export function Logo({
  size = "md",
  className = "",
  showText = true,
}: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src={logoImage}
        alt="Shambani Investment Logo"
        loading="lazy"
        draggable={false}
        className={`${sizeMap[size]} w-auto object-contain select-none`}
      />

      {showText && (
        <span className="sr-only">
          Shambani Investment – Agritech Ecosystem
        </span>
      )}
    </div>
  );
}
