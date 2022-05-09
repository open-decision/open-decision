import { labelStyles } from "../Form/Label";
import { css, darkTheme, keyframes } from "../stitches";
import { innerFocusStyle } from "../stitches/focusStyles";
import {
  activeSelector,
  disabledSelector,
  intentSelector,
} from "../stitches/stateSelectors";

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
  gap: "$1",

  transformOrigin: "var(--radix-dropdown-menu-content-transform-origin)",
  animation: `${scaleIn} 0.1s ease-out`,
});

export const menuItemStyles = css({
  all: "unset",
  colorScheme: "primary",
  textStyle: "medium-text",
  focusType: "inner-intent",
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
  textDecoration: "none !important",

  [`.${darkTheme} &`]: {
    focusColor: "$colorScheme8",
  },

  [`${intentSelector} ${activeSelector}`]: {
    backgroundColor: "$colorScheme2",
    ...innerFocusStyle,

    [`.${darkTheme} &`]: {
      backgroundColor: "$colorScheme4",
      focusColor: "$colorScheme8",
    },
  },

  [`${disabledSelector}`]: {
    color: "$gray11",
    cursor: "not-allowed",

    [`${intentSelector}`]: {
      backgroundColor: "$gray2",
    },
  },
});

export const menuLabelStyles = css(
  {
    gap: "$3",
    marginInline: "$2",
    paddingInline: "$3",
    paddingBlock: "6px",
  },
  labelStyles
);

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
