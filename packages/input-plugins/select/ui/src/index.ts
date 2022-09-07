import { AnswersForm } from "./AnswersForm";
import { AddOptionButton, SingleSelect } from "./SingleSelect";

export const SingleSelectInput = {
  Component: SingleSelect,
  PrimaryActionSlot: AddOptionButton,
};

export const RendererComponents = {
  Component: AnswersForm,
};
