import {
  Link as RouterLink,
  type LinkProps as RouterLinkProps,
} from "@tanstack/react-router";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type NextLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  children?: ReactNode;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
};

function isExternalHref(href: string) {
  return /^(https?:|mailto:|tel:|#)/.test(href);
}

export default function Link({
  href,
  children,
  prefetch: _prefetch,
  replace,
  scroll: _scroll,
  ...props
}: NextLinkProps) {
  if (isExternalHref(href) || props.target === "_blank") {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <RouterLink
      to={href as RouterLinkProps["to"]}
      replace={replace}
      {...props}
    >
      {children}
    </RouterLink>
  );
}
