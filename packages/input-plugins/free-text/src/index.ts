import { FreeText } from "./FreeText";
import { FreeTextForm } from "./FreeTextRenderer";

export * from "./freeTextPlugin";

export const FreeTextInput = {
  Component: FreeText,
};

export const RendererComponent = FreeTextForm;
