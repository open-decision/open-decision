import { styled } from "utils/stitches.config";

export const Badge = styled("span", {
  borderRadius: "$md",
  fontWeight: "$semibold",
  fontSize: "$sm",

  variants: {
    color: {
      red: { backgroundColor: "$red200", color: "$red900" },
      blue: { backgroundColor: "$blue200", color: "$blue900" },
      green: { backgroundColor: "$emerald200", color: "$emerald900" },
      yellow: { backgroundColor: "$amber200", color: "$amber900" },
      indigo: { backgroundColor: "$indigo200", color: "$indigo900" },
      purple: { backgroundColor: "$purple200", color: "$purple900" },
      pink: { backgroundColor: "$pink200", color: "$pink900" },
    },

    size: {
      default: {
        paddingInline: "$3",
      },
      large: {
        paddingInline: "$4",
        paddingBlock: "$1",
      },
    },
  },

  defaultVariants: {
    size: "default",
  },
});
