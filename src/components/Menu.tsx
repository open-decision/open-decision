/**@jsx jsx */
import React from "react";
import { GlobalProps } from "@internalTypes/global";
import { FunctionComponent } from "react";
import { Box, Flex, IconButton, jsx } from "theme-ui";
import styled from "../theme";

type MenuProps = { open: boolean };

export const Menu: FunctionComponent<GlobalProps & MenuProps> = ({
  className,
  children,
}) => {
  return (
    <Box as="nav" sx={{ px: 2 }}>
      <Flex
        as="ul"
        sx={{
          listStyle: "none",
          m: 0,
          p: 0,
          maxWidth: "100%",
          height: "100%",
          justifyContent: "flex-end",
        }}
      >
        {children}
      </Flex>
    </Box>
  );
};

const MenuIconButton: FunctionComponent<GlobalProps> = ({
  children,
  className,
}) => (
  <IconButton
    className={className}
    sx={{
      bg: "grays.2",
      p: 2,
      m: 1,
      transition: "filter 300ms",

      ":hover": {
        filter: "brightness(1.2)",
      },
    }}
  >
    {children}
  </IconButton>
);

type MenuItemProps = {
  icon: string;
  iconSize: number;
};

export const MenuItem: FunctionComponent<GlobalProps & MenuItemProps> = ({
  className,
  icon,
  iconSize,
  children,
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Flex
      as="li"
      sx={{
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={() => setOpen(!open)}
    >
      <MenuIconButton>
        <img src={icon} alt="" sx={{ width: iconSize, height: iconSize }} />
      </MenuIconButton>
      {open ? children : null}
    </Flex>
  );
};

type DropdownItemProps = {
  leftIcon?: JSX.Element | string;
  rightIcon?: JSX.Element | string;
};

const StyledDropdownMenu = styled(Box)`
  position: absolute;
  top: 80px;
  width: 300px;
  transform: translate(-45%);
  background-color: gray;
  padding: 8px;
  overflow: hidden;
`;

export const DropdownMenu: FunctionComponent<GlobalProps> = ({ className }) => {
  const DropdownItem: FunctionComponent<DropdownItemProps> = ({
    children,
    leftIcon,
    rightIcon,
  }) => (
    <Flex
      sx={{
        height: 50,
        alignItems: "center",
        borderRadius: "5px",
        transition: "background 0.2",
        p: 1,

        ":hover": {
          bg: "grays.1",
        },
      }}
    >
      <MenuIconButton>{leftIcon}</MenuIconButton>
      {children}
      <MenuIconButton sx={{ marginLeft: "auto", bg: "inherit" }}>
        {rightIcon}
      </MenuIconButton>
    </Flex>
  );

  return (
    <StyledDropdownMenu>
      <DropdownItem leftIcon="😅">Test</DropdownItem>
      <DropdownItem rightIcon="😍">Another</DropdownItem>
    </StyledDropdownMenu>
  );
};
