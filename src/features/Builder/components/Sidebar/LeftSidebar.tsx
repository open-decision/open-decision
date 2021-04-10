import React from "react";
import { ChevronDownSolid } from "@graywolfai/react-heroicons";
import { motion } from "framer-motion";
import { Tooltip } from "components";
import { useKeyPressEvent } from "react-use";
import { Content, SidebarProps, Toggle, Header, SidebarRoot } from "./shared";

const arrowAnimationVariants = {
  open: { rotate: 90 },
  closed: { rotate: -90 },
};

export const LeftSidebar: React.FC<SidebarProps> = ({
  css,
  children,
  title,
  tooltip,
}) => {
  const [open, setOpen] = React.useState(false);
  useKeyPressEvent("Escape", () => setOpen(false));

  return (
    // @ts-expect-error: stitches error
    <SidebarRoot
      // @ts-expect-error: stitches error
      css={{
        zIndex: "1",
        display: "flex",
        ...css,
      }}
      open={open}
      onOpenChange={() => setOpen(!open)}
    >
      <Content css={{ flexGrow: 1, width: "300px" }}>
        <Header css={{ marginBottom: "$4" }}>{title}</Header>
        {children}
      </Content>
      <Tooltip content={tooltip ? tooltip : title} side="right">
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
    </SidebarRoot>
  );
};
