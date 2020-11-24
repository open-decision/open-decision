// @ts-nocheck
const plugin = require("tailwindcss/plugin");

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: ["./src/**/*.tsx"],
  theme: {
    extend: {
      minWidth: { "1/4": "25%", "1/2": "50%", "3/4": "75%" },
    },
  },
  variants: { backgroundColor: ["responsive", "hover", "focus", "active"] },
  plugins: [
    plugin(function ({ addUtilities }) {
      const newUtilities = {
        ".clickable:active": {
          transform: "translateY(2px)",
        },
      };

      addUtilities(newUtilities);
    }),
  ],
};
