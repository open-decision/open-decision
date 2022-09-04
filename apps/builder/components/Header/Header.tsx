import React from "react";
import {
  StyleObject,
  styled,
  Box,
  buttonStyles,
  Icon,
  Link,
} from "@open-decision/design-system";
import { UserMenu } from "./UserMenu";
import NextLink from "next/link";
import { DashboardIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";

const Container = styled("div", {
  layer: "1",
  paddingInline: "$3",
  borderBottom: "$border$layer",
});

const Content = styled("header", {
  display: "flex",
  alignItems: "center",
  gap: "$2",
  paddingBlock: "$3",
});

type BaseHeaderProps = {
  children?: React.ReactNode;
  css?: StyleObject;
  LogoSlot?: React.ReactNode;
};

export const BaseHeader = ({
  children = <Box css={{ flex: 1 }} />,
  css,
  LogoSlot = <Box />,
}: BaseHeaderProps) => {
  const t = useTranslations("common.header");
  return (
    <Container css={css}>
      <Content>
        <NextLink href="/" passHref>
          <Link
            className={buttonStyles({
              variant: "neutral",
              square: true,
            })}
          >
            <Icon label={t("homeButtonHiddenLabel")}>
              <DashboardIcon />
            </Icon>
          </Link>
        </NextLink>
        {LogoSlot}
        {children}
        <UserMenu />
      </Content>
    </Container>
  );
};
