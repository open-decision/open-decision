import { FullscreenMenu, ListMenu } from "./Menus";
import { Box } from "../Box";
import { styled } from "../stitches";

const Container = styled(Box, {
  $$headerHeight: "calc(50px + $space$4)",
  $$paddingInline: "$space$6",
  paddingInline: "$$paddingInline",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "$$headerHeight",

  "@smallTablet": {
    $$headerHeight: "max-content",
  },
});

const Content = styled("header", {
  maxWidth: "1500px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexGrow: 1,
  gap: "$1 $4",
  flexWrap: "wrap",
});

const Link = styled("a", {
  borderRadius: "$md",
  fontFamily: "$sans",
  fontWeight: "$semibold",
  paddingBlock: "$2",

  [`${ListMenu} & `]: {
    fontSize: "$sm",
  },

  [`${FullscreenMenu} & `]: {
    fontSize: "$xl",
  },

  variants: {
    active: {
      true: {
        color: "$primary11",
      },
    },
  },
});

export type HeaderContainerProps = React.ComponentProps<typeof Container>;
export type HeaderContentProps = React.ComponentProps<typeof Content>;
export type HeaderLinkProps = React.ComponentProps<typeof Link>;
export type HeaderListMenuProps = React.ComponentProps<typeof ListMenu>;
export type HeaderFullScreenMenuProps = React.ComponentProps<
  typeof FullscreenMenu
>;
export const Header = {
  Container,
  Content,
  Link,
  ListMenu,
  FullscreenMenu,
};
