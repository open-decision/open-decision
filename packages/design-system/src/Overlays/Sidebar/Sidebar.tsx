import { AnimatePresence, motion } from "framer-motion";
import { twMerge } from "../../utils";

const sidebarClasses = "z-10 h-full overflow-hidden w-full";

export type SidebarProps = {
  open: boolean;
  children: React.ReactNode;
  className?: string;
};

export function Sidebar({ open, children, className }: SidebarProps) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      {open && (
        <motion.aside
          key="content"
          initial={{ x: "100%" }}
          transition={{ duration: 0.3, type: "tween" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          className={
            className ? twMerge(sidebarClasses, className) : sidebarClasses
          }
        >
          {children}
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
