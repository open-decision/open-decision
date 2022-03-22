import { styled } from "@open-decision/design-system";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

export const Separator = styled(SeparatorPrimitive.Root, {
  backgroundColor: "$gray7",
  "&[data-orientation=horizontal]": { height: 1 },
  "&[data-orientation=vertical]": { width: 1 },
});

export type SeparatorProps = React.ComponentProps<typeof Separator>;
