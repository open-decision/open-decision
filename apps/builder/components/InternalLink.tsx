import Link, { LinkProps } from "next/link";
import {
  Link as SystemLink,
  LinkProps as SystemLinkProps,
} from "@open-decision/design-system";

export type InternalLinkProps = Omit<LinkProps, "passHref" | "as"> & {
  children: React.ReactNode;
} & SystemLinkProps;

export function InternalLink({
  children,
  href,
  replace,
  scroll,
  shallow,
  prefetch,
  locale,
  ...props
}: InternalLinkProps) {
  return (
    <Link
      href={href}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      prefetch={prefetch}
      locale={locale}
      passHref
    >
      <SystemLink {...props}>{children}</SystemLink>
    </Link>
  );
}
