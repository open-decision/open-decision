import { disabledStyle, intentStyle } from "../shared/utils";
import { css, darkTheme, keyframes } from "../stitches";

const scaleIn = keyframes({
  "0%": { opacity: 0, transform: "scale(0)" },
  "100%": { opacity: 1, transform: "scale(1)" },
});

export const menuContainerStyles = css({
  layer: "1",
  paddingBlock: "$1",
  boxShadow: "$7",
  borderRadius: "$md",
  overflow: "hidden",
  zIndex: "$10",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",

  transformOrigin: "var(--radix-dropdown-menu-content-transform-origin)",
  animation: `${scaleIn} 0.1s ease-out`,
});

export const menuItemStyles = css({
  all: "unset",
  colorScheme: "primary",
  textStyle: "medium-text",
  focusType: "inner",
  userSelect: "none",
  display: "flex",
  gap: "$3",
  paddingInline: "$4",
  paddingBlock: "$2",
  minWidth: "200px",
  alignItems: "center",
  wordBreak: "break-word",
  hyphens: "auto",
  cursor: "pointer",

  "&[data-state='checked']": {
    backgroundColor: "$colorScheme3",
  },

  ...intentStyle({
    backgroundColor: "$colorScheme5",
    focusColor: "$colorScheme5",
  }),

  ...disabledStyle({
    color: "$gray11",
    pointerEvents: "none",
  }),
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
  backgroundColor: "$gray4",
  width: "95%",
  height: "1px",
  marginBlock: "$1",
  borderRadius: "$full",

  [`.${darkTheme} &`]: {
    backgroundColor: "$gray8",
  },
});
