import { Story } from "@storybook/react";

export type StoryWithoutCSS<T> = Story<Omit<T, "css">>;
