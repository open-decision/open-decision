const { mapToObj } = require("remeda");
const plugin = require("tailwindcss/plugin");

const colorScales = [
  "gray",
  "primary",
  "accent",
  "danger",
  "success",
  "warning",
  "info",
  "colorScheme",
];

const aliasColor = (alias) => {
  return {
    [`${alias}1`]: `hsl(var(--colors-${alias}1) / <alpha-value>)`,
    [`${alias}2`]: `hsl(var(--colors-${alias}2) / <alpha-value>)`,
    [`${alias}3`]: `hsl(var(--colors-${alias}3) / <alpha-value>)`,
    [`${alias}4`]: `hsl(var(--colors-${alias}4) / <alpha-value>)`,
    [`${alias}5`]: `hsl(var(--colors-${alias}5) / <alpha-value>)`,
    [`${alias}6`]: `hsl(var(--colors-${alias}6) / <alpha-value>)`,
    [`${alias}7`]: `hsl(var(--colors-${alias}7) / <alpha-value>)`,
    [`${alias}8`]: `hsl(var(--colors-${alias}8) / <alpha-value>)`,
    [`${alias}9`]: `hsl(var(--colors-${alias}9) / <alpha-value>)`,
    [`${alias}10`]: `hsl(var(--colors-${alias}10) / <alpha-value>)`,
    [`${alias}11`]: `hsl(var(--colors-${alias}11) / <alpha-value>)`,
    [`${alias}12`]: `hsl(var(--colors-${alias}12) / <alpha-value>)`,
    [`${alias}-text`]: "var(--colors-colorScheme12)",
  };
};

const extendProperties = {
  keyframes: {
    scaleIn: {
      "0%": { opacity: 0, transform: "scale(0)" },
      "100%": { opacity: 1, transform: "scale(1)" },
    },
    fadeIn: {
      "0%": { opacity: 0 },
      "100%": { opacity: 1 },
    },
    dialogShow: {
      "0%": { opacity: 0, transform: "translate(-50%, -48%) scale(.96)" },
      "100%": { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
    },
    slideUpAndFade: {
      "0%": { opacity: 0, transform: "translateY(2px)" },
      "100%": { opacity: 1, transform: "translateY(0)" },
    },

    slideRightAndFade: {
      "0%": { opacity: 0, transform: "translateX(-2px)" },
      "100%": { opacity: 1, transform: "translateX(0)" },
    },

    slideDownAndFade: {
      "0%": { opacity: 0, transform: "translateY(-2px)" },
      "100%": { opacity: 1, transform: "translateY(0)" },
    },

    slideLeftAndFade: {
      "0%": { opacity: 0, transform: "translateX(2px)" },
      "100%": { opacity: 1, transform: "translateX(0)" },
    },
    rotate180: {
      "0%": { transform: "rotate(0deg)" },
      "100%": { transform: "rotate(-180deg)" },
    },
  },
  animation: {
    scaleIn: `scaleIn 0.1s ease-out`,
    fadeIn: `fadeIn 0.15s cubic-bezier(0.16, 1, 0.3, 1)`,
    dialogShow: `dialogShow 0.15s cubic-bezier(0.16, 1, 0.3, 1)`,
    slideUpAndFade: `slideUpAndFade 0.4s cubic-bezier(0.16, 1, 0.3, 1)`,
    slideRightAndFade: `slideRightAndFade 0.4s cubic-bezier(0.16, 1, 0.3, 1)`,
    slideLeftAndFade: `slideLeftAndFade 0.4s cubic-bezier(0.16, 1, 0.3, 1)`,
    slideDownAndFade: `slideDownAndFade 0.4s cubic-bezier(0.16, 1, 0.3, 1)`,
    rotate180: `rotate180 0.2s ease-in-out`,
  },
  colors: {
    ...colorScales.reduce(
      (acc, scale) => (acc = { ...acc, ...aliasColor(scale) }),
      {}
    ),
    black: "hsl(var(--colors-black) / 1)",
    white: "hsl(var(--colors-white) / 1)",
    layer: {
      1: "hsl(var(--colors-layer1) / 1)",
      2: "hsl(var(--colors-layer2) / 1)",
      3: "hsl(var(--colors-layer3) / 1)",
      4: "hsl(var(--colors-layer4) / 1)",
      5: "hsl(var(--colors-layer5) / 1)",
    },
    transparent: "transparent",
    focusColor: "hsla(var(--colors-primary10) / 1)",
    shadowColor: "var(--colors-shadow)",
  },
};

const tokens = {
  spacing: {
    inherit: "inherit",
    0: "0",
    1: "var(--space-1)",
    2: "var(--space-2)",
    3: "var(--space-3)",
    4: "var(--space-4)",
    5: "var(--space-5)",
    6: "var(--space-6)",
    7: "var(--space-7)",
    8: "var(--space-8)",
    9: "var(--space-9)",
    10: "var(--space-10)",
    11: "var(--space-11)",
    12: "var(--space-12)",
  },
  fontSize: {
    "extra-large-heading": "var(--fontSize-extra-large-heading)",
    "large-heading": "var(--fontSize-large-heading)",
    "medium-heading": "var(--fontSize-medium-heading)",
    "small-heading": "var(--fontSize-small-heading)",
    "extra-small-heading": "var(--fontSize-extra-small-heading)",
    "large-text": "var(--fontSize-large-text)",
    "medium-text": "var(--fontSize-medium-text)",
    "small-text": "var(--fontSize-small-text)",
    "extra-small-text": "var(--fontSize-extra-small-text)",
  },
  letterSpacing: {
    "extra-large-heading": "var(--letterSpacing-extra-large-heading)",
    "large-heading": "var(--letterSpacing-large-heading)",
    "medium-heading": "var(--letterSpacing-medium-heading)",
    "small-heading": "var(--letterSpacing-small-heading)",
    "extra-small-heading": "var(--letterSpacing-extra-small-heading)",
    "large-text": "var(--letterSpacing-large-text)",
    "medium-text": "var(--letterSpacing-medium-text)",
    "small-text": "var(--letterSpacing-small-text)",
    "extra-small-text": "var(--letterSpacing-extra-small-text)",
  },
  lineHeight: {
    none: "1",
    "extra-large-heading": "var(--lineHeight-extra-large-heading)",
    "large-heading": "var(--lineHeight-large-heading)",
    "medium-heading": "var(--lineHeight-medium-heading)",
    "small-heading": "var(--lineHeight-small-heading)",
    "extra-small-heading": "var(--lineHeight-extra-small-heading)",
    "large-text": "var(--lineHeight-large-text)",
    "medium-text": "var(--lineHeight-medium-text)",
    "small-text": "var(--lineHeight-small-text)",
    "extra-small-text": "var(--lineHeight-extra-small-text)",
  },
  fontWeight: {
    "extra-large-heading": "var(--fontWeight-extra-large-heading)",
    "large-heading": "var(--fontWeight-large-heading)",
    "medium-heading": "var(--fontWeight-medium-heading)",
    "small-heading": "var(--fontWeight-small-heading)",
    "extra-small-heading": "var(--fontWeight-extra-small-heading)",
    "large-text": "var(--fontWeight-large-text)",
    "medium-text": "var(--fontWeight-medium-text)",
    "small-text": "var(--fontWeight-small-text)",
    "extra-small-text": "var(--fontWeight-extra-small-text)",
  },
  fontFamily: {
    sans: "var(--fontFamily-sans)",
    serif: "var(--fontFamily-serif)",
    heading: "var(--fontFamily-heading)",
    text: "var(--fontFamily-text)",
  },
  borderRadius: {
    none: "var(--radius-none)",
    sm: "var(--radius-sm)",
    md: "var(--radius-md)",
    lg: "var(--radius-lg)",
    xl: "var(--radius-xl)",
    "2xl": "var(--radius-2xl)",
    "3xl": "var(--radius-3xl)",
    "4xl": "var(--radius-4xl)",
    full: "var(--radius-full)",
  },
  boxShadow: {
    1: "0px 0px 2px var(--colors-shadow)",
    2: "0px px 4px var(--colors-shadow)",
    3: "0px 0px 6px var(--colors-shadow)",
    4: "0px 0px 8px var(--colors-shadow)",
    5: "0px 0px 12px var(--colors-shadow)",
    6: "0px 0px 16px var(--colors-shadow)",
    7: "0px 0px 32px var(--colors-shadow)",
    inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
  },
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: { ...tokens, extend: extendProperties },
  plugins: [
    require("@tailwindcss/typography"),
    plugin(function ({ addUtilities, addVariant }) {
      // ------------------------------------------------------------------
      // colorSchemes
      addUtilities({
        ...mapToObj(colorScales, (scale) => [
          [`.colorScheme-${scale}`],
          {
            "--colors-colorScheme1": `var(--colors-${scale}1)`,
            "--colors-colorScheme2": `var(--colors-${scale}2)`,
            "--colors-colorScheme3": `var(--colors-${scale}3)`,
            "--colors-colorScheme4": `var(--colors-${scale}4)`,
            "--colors-colorScheme5": `var(--colors-${scale}5)`,
            "--colors-colorScheme6": `var(--colors-${scale}6)`,
            "--colors-colorScheme7": `var(--colors-${scale}7)`,
            "--colors-colorScheme8": `var(--colors-${scale}8)`,
            "--colors-colorScheme9": `var(--colors-${scale}9)`,
            "--colors-colorScheme10": `var(--colors-${scale}10)`,
            "--colors-colorScheme11": `var(--colors-${scale}11)`,
            "--colors-colorScheme12": `var(--colors-${scale}12)`,
          },
        ]),
      });

      // ------------------------------------------------------------------
      // variant selectors

      const focusSelector = [
        "&:focus-visible",
        "&[data-focus='true']",
        "&[data-focus-visible]",
      ];

      addVariant("focus", focusSelector);
      addVariant("focus-within", [...focusSelector, "&:focus-within"]);

      const intentSelector = [
        ...focusSelector,
        "&[data-focus='true']",
        "&:hover",
      ];

      addVariant("intent", intentSelector);
      addVariant("intent-within", [...intentSelector, "&:focus-within"]);

      const active = [
        "&:active",
        "&[data-active='true']",
        "&[data-active-item]",
        "&[data-state=on]",
      ];

      addVariant("active", active);

      addVariant("disabled", ["&:disabled", "&[data-disabled]"]);

      addVariant("intent-active", [...intentSelector, ...active]);
    }),
    plugin(function (helpers) {
      // variants that help styling Radix-UI components
      dataStateVariant("open", helpers);
      dataStateVariant("closed", helpers);
      dataStateVariant("on", helpers);
      dataStateVariant("checked", helpers);
      dataStateVariant("unchecked", helpers);
    }),
  ],
};

function dataStateVariant(
  state,
  {
    addVariant, // for registering custom variants
    e, // for manually escaping strings meant to be used in class names
  }
) {
  addVariant(`data-state-${state}`, ({ modifySelectors, separator }) => {
    modifySelectors(({ className }) => {
      return `.${e(
        `data-state-${state}${separator}${className}`
      )}[data-state='${state}']`;
    });
  });

  addVariant(`group-data-state-${state}`, ({ modifySelectors, separator }) => {
    modifySelectors(({ className }) => {
      return `.group[data-state='${state}'] .${e(
        `group-data-state-${state}${separator}${className}`
      )}`;
    });
  });

  addVariant(`peer-data-state-${state}`, ({ modifySelectors, separator }) => {
    modifySelectors(({ className }) => {
      return `.peer[data-state='${state}'] ~ .${e(
        `peer-data-state-${state}${separator}${className}`
      )}`;
    });
  });
}
