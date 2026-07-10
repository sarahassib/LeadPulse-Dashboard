interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md";
}

const variantStyles: Record<string, string> = {
  default: "bg-surface-elevated text-text-secondary border-border",
  success: "bg-primary-500/10 text-primary-400 border-primary-500/20",
  warning: "bg-accent-500/10 text-accent-400 border-accent-500/20",
  danger: "bg-red-500/10 text-red-400 border-red-500/20",
  info: "bg-accent-500/10 text-accent-400 border-accent-500/20",
};

const sizeStyles: Record<string, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
};

export default function Badge({
  children,
  variant = "default",
  size = "md",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${variantStyles[variant]} ${sizeStyles[size]}`}
    >
      {children}
    </span>
  );
}
