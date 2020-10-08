import React, { FunctionComponent, RefAttributes, PropsWithoutRef, ForwardRefExoticComponent } from "react";
import { Link as RouterLink, LinkProps as RouterLinkProps } from "react-router-dom";
import { Link as ThemeUILink, LinkProps as ThemedUILinkProps } from "theme-ui";

// ripped from @types/theme-ui__components: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/86bd530585927c9a4e16bc8f5db17439b66c30b3/types/theme-ui__components/index.d.ts#L21
type ForwardRef<T, P> = ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>>;

// 1. Combine both link types from theme-ui and react router
type CombinedProps = ThemedUILinkProps & RouterLinkProps<Record<string, unknown>>;

// 2. Create a new component with the above type
const FinalLink: ForwardRef<HTMLAnchorElement, CombinedProps> = ThemeUILink;

export const Link: FunctionComponent<CombinedProps> = ({ children, ...props }) => {
  return (
    // 3. use the as prop to replace the underlying component with react router link
    <FinalLink as={RouterLink} {...props}>
      {children}
    </FinalLink>
  );
};
