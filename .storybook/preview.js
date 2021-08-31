import { darkTheme } from "../src/stitches";
import { useDarkMode } from "storybook-dark-mode";
import { DocsContainer } from "./components/DocsContainer";

export const parameters = {
  docs: {
    container: DocsContainer,
  },
  darkMode: {
    darkClass: "dark",
    lightClass: "light",
    stylePreview: true,
  },
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators = [
  (Story) => {
    const isDarkMode = useDarkMode();

    return (
      <div className={isDarkMode ? darkTheme : null}>
        <Story />
      </div>
    );
  },
];
