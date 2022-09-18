import { FreeText } from "./FreeText";
import { FreeTextForm } from "./FreeTextRenderer";

export * from "./freeTextPlugin";
export * from "./types";

export const FreeTextInput = {
  Component: FreeText,
};

export const RendererComponent = FreeTextForm;
