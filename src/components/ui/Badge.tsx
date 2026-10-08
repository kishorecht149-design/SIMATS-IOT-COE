import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "destructive" | "tech";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const variantClasses = {
    default: "bg-primary text-primary-foreground border-transparent",
    secondary: "bg-secondary text-secondary-foreground border-transparent",
    outline: "text-foreground border-border bg-transparent",
    success: "bg-emerald-950/40 text-emerald-400 border-emerald-800/60 dark:bg-emerald-950/60 dark:text-emerald-300",
    warning: "bg-amber-950/40 text-amber-400 border-amber-800/60 dark:bg-amber-950/60 dark:text-amber-300",
    destructive: "bg-red-950/40 text-red-400 border-red-800/60 dark:bg-red-950/60 dark:text-red-300",
    tech: "bg-muted text-muted-foreground border-border font-mono tracking-tight uppercase",
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px] tracking-wider",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 font-medium border rounded transition-colors select-none",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
