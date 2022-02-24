import React from "react";
import { css, StyleObject } from "@open-legal-tech/design-system";
import { AnimatePresence, motion } from "framer-motion";

const styledMotionDiv = css({
  display: "flex",
  flexDirection: "column",
  overflowY: "auto",
  position: "relative",
  backgroundColor: "$gray2",
  gap: "$6",
  paddingInlineEnd: "$5",
  paddingInlineStart: "$5",
  paddingBlock: "$5",
});

type SidebarProps = {
  open: boolean;
  css?: StyleObject;
  children: React.ReactNode;
};

export const Sidebar = ({ children, open, css }: SidebarProps): JSX.Element => {
  return (
    <AnimatePresence exitBeforeEnter>
      {open && (
        <motion.div
          key="sidebar"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.3, type: "spring", bounce: 0 }}
          className={styledMotionDiv({ css }).className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
