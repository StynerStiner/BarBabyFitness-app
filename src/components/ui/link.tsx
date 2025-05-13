import { AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

export const Link = ({ href, className, children, ...props }: LinkProps) => {
  return (
    <a href={href} className={cn("cursor-pointer", className)} {...props}>
      {children}
    </a>
  );
};
