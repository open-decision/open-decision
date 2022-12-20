import React from "react";
import {
  ClassNameArrayProp,
  LoadingSpinner,
  Row,
  Stack,
} from "@open-decision/design-system";

function Loading({ className }: { className?: ClassNameArrayProp }) {
  return (
    <Row center classNames={["h-screen bg-layer-2", className]}>
      <LoadingSpinner />
    </Row>
  );
}

export type LayoutProps = {
  children: React.ReactNode;
  className?: ClassNameArrayProp;
};

export const Layout = React.forwardRef<HTMLDivElement, LayoutProps>(
  function Layout({ children, className }, ref) {
    return (
      <>
        <React.Suspense fallback={<Loading className={className} />}>
          <Stack classNames={["h-full w-full bg-layer-2", className]} ref={ref}>
            {children}
          </Stack>
        </React.Suspense>
      </>
    );
  }
);
