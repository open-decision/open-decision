export const iconSizes = {
  small: {
    $$paddingInline: "$space$2",
    $$iconSize: "18px",
    // paddingBlock: "$$paddingInline",

    "& > svg": {
      width: "$$iconSize",
      height: "$$iconSize",
    },
  },
  medium: {
    $$paddingInline: "$space$2",
    $$iconSize: "22px",
    // paddingBlock: "$$paddingInline",

    "& > svg": {
      width: "$$iconSize",
      height: "$$iconSize",
    },
  },
  large: {
    $$paddingInline: "$space$3",
    $$iconSize: "24px",
    // paddingBlock: "$$paddingInline",

    "& > svg": {
      width: "$$iconSize",
      height: "$$iconSize",
    },
  },
} as const;
