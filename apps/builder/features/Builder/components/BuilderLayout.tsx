import * as React from "react";
import { TreeProvider } from "../state/treeStore/TreeContext";

type BuilderLayoutProps = { children: React.ReactNode };

export function BuilderLayout({ children }: BuilderLayoutProps) {
  return <TreeProvider>{children}</TreeProvider>;
}
