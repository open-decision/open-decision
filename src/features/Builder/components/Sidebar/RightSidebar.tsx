import React from "react";
import { SidebarProps, Content, Header, Toggle, SidebarRoot } from "./shared";
import { ChevronDownSolid } from "@graywolfai/react-heroicons";
import { Tooltip } from "components";
import { motion } from "framer-motion";
import { useKeyPressEvent } from "react-use";

const arrowAnimationVariants = {
  open: { rotate: -90 },
  closed: { rotate: 90 },
};

export const RightSidebar: React.FC<SidebarProps> = ({
  css,
  children,
  title,
  tooltip,
  open,
  onOpenChange,
}) => {
  useKeyPressEvent("Escape", () => (onOpenChange ? onOpenChange(false) : null));

  return (
    // @ts-expect-error: stitches error
    <SidebarRoot
      // @ts-expect-error: stitches error
      css={{
        display: "flex",
        justifyContent: "flex-end",
        zIndex: "1",
        ...css,
      }}
      open={open}
      onOpenChange={onOpenChange}
    >
      <Tooltip content={tooltip ? tooltip : title} side="left">
        <Toggle>
          <motion.div
            variants={arrowAnimationVariants}
            animate={open ? "open" : "closed"}
            initial="closed"
          >
            <ChevronDownSolid />
          </motion.div>
        </Toggle>
      </Tooltip>
      <Content css={{ flexGrow: 1, width: "clamp(300px, 40vw, 600px)" }}>
        <Header css={{ marginBottom: "$4" }}>{title}</Header>
        {children}
      </Content>
    </SidebarRoot>
  );
};
