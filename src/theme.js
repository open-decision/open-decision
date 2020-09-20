import { roboto } from "@theme-ui/presets";

const tokens = {
  fonts: {
    body: "Roboto, sans-serif",
    heading: '"Roboto Condensed", sans-serif',
    monospace: "Menlo, monospace",
  },
  colors: {
    text: "#000",
    background: "#fff",
    primary: "blue",
    secondary: "red",
    tertiary: { primary: "#54DE95", contrast: "#0D6336" },
    grays: ["#FAFAFA", "#F0F0F0", "#E5E5E5", "#818181", "#66615B"],
  },
  space: [
    0,
    "0.25rem",
    "0.5rem",
    "1rem",
    "2rem",
    "3rem",
    "4rem",
    "8rem",
    "16rem",
    "32rem",
  ],
  fontSizes: [
    "0.7rem",
    "0.9rem",
    "1rem",
    "1.25rem",
    "1.5rem",
    "2rem",
    "3rem",
    "4rem",
    "8rem",
  ],
  radii: [
    "0",
    "0.5rem",
    "0.8rem",
    "1rem",
    "1.25rem",
    "1.5rem",
    "2rem",
    "3rem",
    "4rem",
    "8rem",
  ],
  shadows: [
    "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
    "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
    "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
    "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
    "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)",
  ],
  text: {
    default: {
      fontFamily: "body",
    },
    heading: {
      fontFamily: "heading",
      fontWeight: "heading",
      lineHeight: "heading",
    },
    headingLarge: {
      variant: "text.heading",
      fontSize: 5,
      my: 3,
    },
  },

  buttons: {
    primary: {
      bg: "tertiary.primary",
      color: "tertiary.contrast",
      display: "flex",
      placeItems: "center",
      borderRadius: 1,
    },
    large: {
      variant: "buttons.primary",
      p: 4,
      borderRadius: 2,
    },
    icon: { width: 48, height: 48, borderRadius: 99999 },
  },
  badges: {
    primary: {
      fontFamily: "body",
      borderRadius: "4px",
      py: 1,
      px: 2,
      fontSize: 0,
    },
  },
  forms: {
    label: {
      fontFamily: "body",
    },
    input: {
      fontFamily: "body",
      bg: "grays.0",
      borderRadius: 1,
    },
    select: {
      borderRadius: 1,
      "&:focus": {
        border: "2px solid blue",
      },
    },
  },
  layout: {
    container: {
      maxWidth: "1000px",
    },
  },
  cards: {
    primary: {
      p: 3,
      border: "1px solid black",
    },
  },
  images: {
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 99999,
    },
  },
};

export default { ...roboto, ...tokens };
