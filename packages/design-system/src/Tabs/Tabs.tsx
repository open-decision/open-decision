import * as TabsPrimitive from "@radix-ui/react-tabs";
import { styled } from "../stitches";

export const Tabs = {
  Root: TabsPrimitive.Root,
  List: TabsPrimitive.List,
  Trigger: TabsPrimitive.Trigger,
  Content: styled(TabsPrimitive.Content),
};
