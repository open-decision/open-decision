import { AnimatePresence, motion } from "framer-motion";

export type SidebarProps = { open: boolean; children: React.ReactNode };

export function Sidebar({ open, children }: SidebarProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.aside
          layout
          initial={{ x: "100%" }}
          animate={{
            x: 0,
            transition: { duration: 0.5, type: "spring", bounce: 0 },
          }}
          exit={{
            x: "100%",
            transition: {
              duration: 0.3,
              type: "spring",
              bounce: 0,
              delay: 0.1,
            },
          }}
          style={{
            gridRow: "1 / -1",
            gridColumn: "2",
            zIndex: "$10",
            height: "100%",
            overflow: "hidden scroll",
            width: "100%",
          }}
        >
          {children}
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
