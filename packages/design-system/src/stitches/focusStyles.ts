export const outerFocusStyle = {
  boxShadow: `0 0 0 1px var(--layer, $colors$layer1), 0 0 0 3px var(--colors-focusColor, $colors$primary10)`,
  outline: "none",
};

export const innerFocusStyle = {
  boxShadow: `inset 0 0 0 1px var(--colors-focusColor, $colors$primary10)`,
  borderColor: `var(--colors-focusColor, $colors$primary10)`,
  outline: "none",
};
