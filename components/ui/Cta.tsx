import type { ReactNode } from "react";

import { ArrowIcon } from "@/components/ui/ArrowIcon";

type CtaProps = {
  href: string;
  children: ReactNode;
  external?: boolean;
  className?: string;
};

export function Cta({ href, children, external = false, className }: CtaProps) {
  const classes = ["cta", className].filter(Boolean).join(" ");

  return (
    <a
      className={classes}
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span>{children}</span>
      <ArrowIcon />
    </a>
  );
}
