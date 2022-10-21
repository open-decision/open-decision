import { labelStyles } from "@open-decision/design-system/src/Form/Label";
import { css, darkTheme, keyframes } from "@open-decision/design-system/src/stitches";
import {
  activeSelector,
  disabledSelector,
  intentSelector,
} from "@open-decision/design-system/src/stitches/stateSelectors";
import { textStyles } from "@open-decision/design-system/src/Text";
import { Link } from "@open-decision/design-system/src/Link/Link";

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
  border: "$border$layer",

  transformOrigin: "var(--radix-dropdown-menu-content-transform-origin)",
  animation: `${scaleIn} 0.1s ease-out`,
});

export const menuItemStyles = css(
  {
    all: "unset",
    colorScheme: "primary",
    focusType: "inner",
    userSelect: "none",
    display: "flex",
    gap: "$3",
    marginInline: "$2",
    paddingInline: "$3",
    paddingBlock: "6px",
    borderRadius: "$md",
    minWidth: "200px",
    wordBreak: "break-word",
    hyphens: "auto",
    cursor: "pointer",
    "--fontWeights-medium-text": 500,
    border: "1px solid transparent",
    focusColor: "$colorScheme6",
    textDecoration: "none !important",
    alignItems: "center",

    [`.${darkTheme} &`]: {
      focusColor: "$colorScheme8",
    },

    [`${intentSelector}, ${activeSelector}`]: {
      backgroundColor: "$colorScheme2",

      [`.${darkTheme} &`]: {
        backgroundColor: "$colorScheme4",
      },
    },

    [`${disabledSelector}`]: {
      color: "$gray11",
      colorScheme: "gray",
      cursor: "not-allowed",
    },

    [`& ${Link}`]: {
      color: "inherit",
      focusType: "inner",
    },
  },
  textStyles
);

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
