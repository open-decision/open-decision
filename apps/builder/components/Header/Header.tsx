import React from "react";
import { buttonClasses, Icon, twMerge } from "@open-decision/design-system";
import { UserMenu } from "./UserMenu";
import NextLink from "next/link";
import { DashboardIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";

const containerClasses = "bg-layer-1 px-3 border-b border-gray7";

const contentClasses = "flex items-center gap-2 py-3";

type BaseHeaderProps = {
  children?: React.ReactNode;
  className?: string;
  LogoSlot?: React.ReactNode;
};

export const BaseHeader = ({
  children = <div className="flex-1" />,
  className,
  LogoSlot = <div />,
}: BaseHeaderProps) => {
  const t = useTranslations("common.header");
  return (
    <div
      className={
        className ? twMerge(containerClasses, className) : containerClasses
      }
    >
      <header className={contentClasses}>
        <NextLink
          className={buttonClasses({ variant: "neutral", square: true }, [])}
          href="/"
        >
          <Icon size="small" label={t("homeButtonHiddenLabel")}>
            <DashboardIcon />
          </Icon>
        </NextLink>
        {LogoSlot}
        {children}
        <UserMenu />
      </header>
    </div>
  );
};
