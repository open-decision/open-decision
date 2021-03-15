import { styled } from "utils/stitches.config";
import * as Collapsible from "@radix-ui/react-collapsible";
import { motion } from "framer-motion";

export const SidebarRoot = styled(Collapsible.Root, {});

export type SidebarProps = React.ComponentProps<typeof SidebarRoot> & {
  title: string;
  tooltip?: string;
  width: number;
};

export const AnimationContainer = styled(motion.div, {
  height: "100%",
  display: "grid",
  gridTemplateColumns: "repeat(2, max-content)",
});

export const Content = styled(Collapsible.Content, {
  backgroundColor: "$warmGray100",
  padding: "$4",
  height: "100%",
  boxShadow: "$xl",
});

export const Toggle = styled(Collapsible.Button, {
  margin: "$4",
  width: "40px",
  height: "40px",
  padding: "$1",
  borderRadius: "$md",
  backgroundColor: "$warmGray200",
});

export const Header = styled("h2", {
  fontSize: "$md",
  color: "$gray600",
  fontWeight: "$semibold",
});
