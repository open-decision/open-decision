import * as TabsPrimitive from "@radix-ui/react-tabs";
import { styled } from "@open-decision/design-system/src/stitches";

export const Tabs = {
  Root: TabsPrimitive.Root,
  List: TabsPrimitive.List,
  Trigger: TabsPrimitive.Trigger,
  Content: styled(TabsPrimitive.Content),
};
