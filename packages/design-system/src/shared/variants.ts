import { css, createScaleVariant } from "../stitches";

export const center = css({
  variants: {
    center: {
      true: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      },
    },
  },
});

export const gap = css({
  $$gap: "$1",
  gap: "$$gap",
  variants: {
    gap: createScaleVariant("space", (token) => ({ $$gap: `$space${token}` })),
  },
});

export const padding = css({
  $$padding: "$space$1",
  padding: "$$padding",
  variants: {
    padding: createScaleVariant("space", (token) => ({
      $$padding: `$space${token}`,
    })),
  },
});
