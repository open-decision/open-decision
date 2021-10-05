/**
 * Add a Variant to align the element by its content box instead of at the border.
 * `$$paddingInline` and `$$borderWidth` need to be defined as variables and set to the value
 * of their respective properties.
 * @returns the custom property `$$XTranslation`. Use it to apply the transform.
 */
export const alignByContent = {
  left: {
    $$XTranslation: "calc(($$borderWidth + $$paddingInline) * -1)",
  },
  right: {
    $$XTranslation: "calc($$borderWidth + $$paddingInline)",
  },
  center: {
    $$XTranslation: "0px",
  },
} as const;
