import React from "react";
import { ChevronDownSolid } from "@graywolfai/react-heroicons";
import { motion } from "framer-motion";
import { Tooltip } from "components";
import { useKeyPressEvent } from "react-use";
import {
  AnimationContainer,
  Content,
  SidebarProps,
  Toggle,
  Header,
  SidebarRoot,
} from "./shared";

const arrowAnimationVariants = {
  open: { rotate: 90 },
  closed: { rotate: -90 },
};

export const LeftSidebar: React.FC<SidebarProps> = ({
  css,
  children,
  title,
  tooltip,
  width,
}) => {
  const [open, setOpen] = React.useState(false);
  useKeyPressEvent("Escape", () => setOpen(false));

  const sidebarAnimationVariants = {
    open: { x: 0 },
    closed: { x: `-${width}px` },
  };

  return (
    // @ts-expect-error: stitches error
    <SidebarRoot
      // @ts-expect-error: stitches error
      css={{ zIndex: open ? "1" : "initial", ...css }}
      open={open}
      onOpenChange={() => setOpen(!open)}
    >
      <AnimationContainer
        animate={open ? "open" : "closed"}
        initial="closed"
        variants={sidebarAnimationVariants}
        transition={{ duration: 0.3 }}
      >
        <Content forceMount css={{ width }}>
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
      </AnimationContainer>
    </SidebarRoot>
  );
};
