import { darkTheme } from "@open-legal-tech/design-system";
import { useDarkMode } from "storybook-dark-mode";
import { DocsContainer } from "./components/DocsContainer";
import "@fontsource/poppins/100.css";
import "@fontsource/poppins/200.css";
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/800.css";
import "@fontsource/poppins/900.css";

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
