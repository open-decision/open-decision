import clsx from "clsx";
import React from "react";
import Link from "next/link";

export const Logo: React.FC<Record<string, unknown>> = () => (
  <Link href="/">
    <h1 className={clsx("w-44")}>
      <img src="/assets/OD_LOGO.svg" alt="open-decision logo" />
    </h1>
  </Link>
);
