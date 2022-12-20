import * as React from "react";
import { Input as SystemInput } from "./Input";
import { Button as SystemButton } from "../../Button/Button";
import { twMerge } from "../../utils";

export type InputWithButtonProps = {
  Input: React.ReactElement<React.ComponentProps<typeof SystemInput>>;
  Button: React.ReactElement<React.ComponentProps<typeof SystemButton>>;
  className?: string;
};

const containerClasses = "flex flex-wrap";

const inputClasses =
  "flex-1 basis-full rounded-none rounded-tl-inherit rounded-tr-inherit md:rounded-tr-none md:rounded-bl-inherit";
const buttonClasses =
  "flex-grow flex-shrink-0 basis-full rounded-none max-w-[unset] rounded-br-inherit rounded-bl-inherit md:rounded-bl-none md:rounded-tl-none md:rounded-tr-inherit";

export const InputWithButton = ({
  Input,
  Button,
  className,
}: InputWithButtonProps) => {
  return (
    <div
      className={
        className ? twMerge(containerClasses, className) : containerClasses
      }
    >
      {React.cloneElement(Input, {
        ...Input.props,
        className: twMerge(inputClasses, Input.props?.["className"]),
      })}
      {React.cloneElement(Button, {
        ...Button.props,
        className: twMerge(buttonClasses, Button.props?.["className"]),
      })}
    </div>
  );
};
