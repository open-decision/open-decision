import { disabledStyle, intentStyle } from "../shared/utils";
import { css, darkTheme, keyframes } from "../stitches";

const scaleIn = keyframes({
  "0%": { opacity: 0, transform: "scale(0)" },
  "100%": { opacity: 1, transform: "scale(1)" },
});

export const menuContainerStyles = css({
  layer: "1",
  paddingBlock: "$2",
  boxShadow: "$7",
  borderRadius: "$md",
  overflow: "hidden",
  zIndex: "$10",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "$1",

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
  marginInline: "$2",
  paddingInline: "$3",
  paddingBlock: "6px",
  borderRadius: "$md",
  minWidth: "200px",
  alignItems: "center",
  wordBreak: "break-word",
  hyphens: "auto",
  cursor: "pointer",
  fontWeight: "500",
  border: "1px solid transparent",
  focusColor: "$colorScheme6",

  [`.${darkTheme} &`]: {
    focusColor: "$colorScheme8",
  },

  ...intentStyle({
    backgroundColor: "$colorScheme2",
    focusType: "inner",

    [`.${darkTheme} &`]: {
      backgroundColor: "$colorScheme4",
      focusColor: "$colorScheme8",
    },
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
