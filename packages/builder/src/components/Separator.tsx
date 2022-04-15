import { styled } from "@open-decision/design-system";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

export const Separator = styled(SeparatorPrimitive.Root, {
  backgroundColor: "$gray5",
  borderRadius: "$full",
  $$size: "1px",

  "&[data-orientation=horizontal]": { height: "$$size" },
  "&[data-orientation=vertical]": { width: "$$size" },
});

export type SeparatorProps = React.ComponentProps<typeof Separator>;
