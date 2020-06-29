import React from "react";
import { motion } from "framer-motion";

export const Greeting = ({ children, ...props }) => {
  return (
    <motion.div sx={{ fontSize: 6, color: "grays.2" }} {...props}>
      Hallo, {children}!
    </motion.div>
  );
};
