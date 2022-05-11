import * as Form from "ariakit/form";
import { styled } from "../stitches";
import { Checkbox as SystemCheckbox } from "./Checkbox";
import { labelStyles } from "./Label";
import { Input as SystemInput, InputProps as SystemInputProps } from "./Input";
import { ErrorMessage } from "./ErrorMessage";
import {
  Item as SystemRadioButton,
  Root as SystemRadioGroup,
} from "./RadioButton";
import { Button, SubmitButton, SubmitButtonProps } from "../Button";

export const Root = styled(Form.Form, {
  gap: "$2",
  display: "flex",
  flexDirection: "column",
});
export type RootProps = React.ComponentProps<typeof Root>;

export const Checkbox = styled(Form.FormCheckbox, SystemCheckbox);
export type CheckboxProps = React.ComponentProps<typeof Checkbox>;

export const Label = styled(Form.FormLabel, labelStyles);
export type LabelProps = React.ComponentProps<typeof Label>;

export type InputProps = Form.FormInputProps & Omit<SystemInputProps, "name">;
export const Input = (props: InputProps) => (
  <Form.FormInput as={SystemInput} {...props} />
);

export const Error = styled(Form.FormError, ErrorMessage);
export type ErrorProps = React.ComponentProps<typeof Error>;

export const RadioButton = styled(Form.FormRadio, SystemRadioButton);
export type RadioButtonProps = React.ComponentProps<typeof RadioButton>;

export const RadioGroup = styled(Form.FormRadioGroup, SystemRadioGroup);
export type RadioGroupProps = React.ComponentProps<typeof RadioGroup>;

export const Description = styled(Form.FormDescription, {});
export type DescriptionProps = React.ComponentProps<typeof Description>;

export const Push = styled(Form.FormPush, Button);
export type PushProps = React.ComponentProps<typeof Push>;

export const Reset = styled(Form.FormReset, Button);
export type ResetProps = React.ComponentProps<typeof Reset>;

export const Remove = styled(Form.FormRemove, Button);
export type RemoveProps = React.ComponentProps<typeof Remove>;

export type SubmitProps = Form.FormSubmitProps & SubmitButtonProps;
export const Submit = (props) => (
  <Form.FormSubmit as={SubmitButton} {...props} />
);

export { Field } from "./Field";
export type { FieldProps } from "./Field";

export { FormField as CustomControl } from "ariakit/form";
export type { FormFieldProps as CustomControlProps } from "ariakit/form";

export {
  useForm,
  useFormCheckbox,
  useFormDescription,
  useFormError,
  useFormGroup,
  useFormGroupLabel,
  useFormInput,
  useFormLabel,
  useFormPush,
  useFormRadio,
  useFormRadioGroup,
  useFormRemove,
  useFormReset,
  useFormState,
  useFormSubmit,
} from "ariakit/form";

export type { FormState } from "ariakit/form";
