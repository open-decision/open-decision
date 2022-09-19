import { AnswersForm } from "./ui/AnswersForm";
import { SingleSelect, AddOptionButton } from "./ui/SingleSelect";

export * from "./selectPlugin";
export type { TSelectInput } from "./selectPlugin";

export const SingleSelectInput = {
  Component: SingleSelect,
  PrimaryActionSlot: AddOptionButton,
};

export const RendererComponent = AnswersForm;
