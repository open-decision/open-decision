import * as React from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { IconButton } from "../../IconButton";
import { keyframes, styled } from "../../stitches";
import { Box } from "../../Box";

type MenuTriggerProps = React.ComponentProps<typeof IconButton>;

const MenuTrigger = ({ Icon, ...props }: MenuTriggerProps) => {
  return (
    <Collapsible.Trigger asChild>
      <IconButton
        variant="ghost"
        css={{ colorScheme: "gray" }}
        Icon={Icon}
        {...props}
      >
        {props.children}
      </IconButton>
    </Collapsible.Trigger>
  );
};

const open = keyframes({
  from: { height: 0 },
  to: { height: "var(--radix-collapsible-content-height)" },
});

const close = keyframes({
  from: { height: "var(--radix-collapsible-content-height)" },
  to: { height: 0 },
});

const StyledMenuContent = styled(Collapsible.Content, {
  display: "flex",
  fontSize: "$2xl",
  alignItems: "center",
  flexDirection: "column",
  position: "absolute",
  top: "$$headerHeight",
  left: 0,
  gap: "$12",
  flexWrap: "wrap",

  "@animation": {
    '&[data-state="open"]': { animation: `${open} 200ms ease-out` },
    '&[data-state="closed"]': { animation: `${close} 200ms ease-out` },
  },
});

type MenuContentProps = React.ComponentProps<typeof StyledMenuContent> & {
  title: string;
};

const MenuContent = ({ title, ...props }: MenuContentProps) => {
  return (
    <StyledMenuContent {...props}>
      <Box
        css={{
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: "$6",
          width: "100vw",
          height: "calc(100vh - $$headerHeight)",
          overflow: "auto",
          padding: "$8 $$paddingInline",
          backgroundColor: "var(--bgColor, $colors$gray2)",
        }}
      >
        {props.children}
      </Box>
    </StyledMenuContent>
  );
};

const Menu = styled("nav", {
  "@smallTablet": {
    display: "none",
  },
});

type MenuContainerProps = Omit<
  React.ComponentProps<typeof Menu>,
  "children"
> & {
  children: React.ReactElement | React.ReactElement[];
  MenuTrigger: React.ReactElement<React.ComponentProps<typeof MenuTrigger>>;
  CloseTrigger?: React.ReactElement<React.ComponentProps<typeof MenuTrigger>>;
};

const MenuContainer = ({
  children,
  MenuTrigger,
  CloseTrigger,
  ...props
}: MenuContainerProps) => {
  const [open, setOpen] = React.useState(false);

  const closeMenu = () => setOpen(false);

  const childrenWithOnClick = React.Children.map(children, (child) =>
    React.cloneElement(child, { onClick: closeMenu })
  );

  const MenuTriggerWithOnClick = React.cloneElement(MenuTrigger, {
    onClick: closeMenu,
  });

  const CloseTriggerWithOnClick = React.cloneElement(
    CloseTrigger ?? MenuTrigger,
    {
      onClick: closeMenu,
    }
  );

  return (
    <Menu {...props}>
      <Collapsible.Root
        open={open}
        onOpenChange={(newState) => (newState ? setOpen(newState) : null)}
      >
        {open ? CloseTriggerWithOnClick : MenuTriggerWithOnClick}
        {childrenWithOnClick}
      </Collapsible.Root>
    </Menu>
  );
};

export const ListMenu = styled("nav", {
  display: "none",

  "@smallTablet": {
    columnGap: "$10",
    display: "flex",
  },
});
export const FullscreenMenu = {
  Container: MenuContainer,
  Trigger: MenuTrigger,
  Content: MenuContent,
};
