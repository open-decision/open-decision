import { LoadingSpinner } from "@open-decision/design-system";
import * as React from "react";
import { TreeProvider } from "../state/treeStore/TreeContext";

type BuilderLayoutProps = { children: React.ReactNode };

export function BuilderLayout({ children }: BuilderLayoutProps) {
  return (
    <React.Suspense fallback={<LoadingSpinner />}>
      <TreeProvider>{children}</TreeProvider>
    </React.Suspense>
  );
}
