import { css, keyframes } from "../stitches";

const scaleIn = keyframes({
  "0%": { opacity: 0, transform: "scale(0)" },
  "100%": { opacity: 1, transform: "scale(1)" },
});

export const menuContainerStyles = css({
  backgroundColor: "$gray2",
  padding: "$2",
  border: "1px solid $colors$gray8",
  boxShadow: "$4",
  borderRadius: "$md",

  transformOrigin: "var(--radix-dropdown-menu-content-transform-origin)",
  animation: `${scaleIn} 0.1s ease-out`,
});

export const menuItemStyles = css({
  all: "unset",
  colorScheme: "primary",
  textStyle: "medium-text",
  focusStyle: "inner",
  userSelect: "none",
  display: "grid",
  gridTemplateColumns: "max-content 1fr",
  alignItems: "center",
  borderRadius: "$md",
  paddingInline: "$2",
  paddingBlock: "$2",
  gap: "$2",

  "&:focus": {
    backgroundColor: "$colorScheme9",
    color: "$colorScheme1",
  },

  "&[data-disabled]": {
    color: "$colorScheme8",
    pointerEvents: "none",
  },
});

export const menuLabelStyles = css({
  variants: {
    variant: {
      small: {
        textStyle: "small-text",
      },
      medium: {
        textStyle: "medium-text",
      },
    },
  },

  defaultVariants: {
    variant: "medium",
  },
});

export const menuSeparatorStyles = css({
  fill: "$gray8",
});
