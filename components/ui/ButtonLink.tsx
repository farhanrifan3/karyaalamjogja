import type { ReactNode } from "react";

type ButtonVariant = "main" | "wa" | "line";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
  external?: boolean;
};

export function ButtonLink({
  href,
  children,
  variant = "main",
  className,
  external = false,
}: ButtonLinkProps) {
  const classes = ["btn", `btn-${variant}`, className].filter(Boolean).join(" ");

  return (
    <a
      className={classes}
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
