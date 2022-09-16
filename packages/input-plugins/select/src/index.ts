import { AnswersForm } from "./ui/AnswersForm";
import { SingleSelect, AddOptionButton } from "./ui/SingleSelect";

export { SelectPlugin } from "./selectPlugin";
export type { TSelectInput } from "./selectPlugin";
export type { TAnswer } from "./types";

export const SingleSelectInput = {
  Component: SingleSelect,
  PrimaryActionSlot: AddOptionButton,
};

export const RendererComponents = {
  Component: AnswersForm,
};
