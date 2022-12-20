import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button, ButtonProps } from "../../Button";
import { SubmitButton, SubmitButtonProps } from "../../Button/SubmitButton";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Icon } from "../../Icon/Icon";
import { rowClasses, stackClasses } from "../../Layout";
import { twMerge } from "../../utils";
import { Heading } from "../../Heading/Heading";

// ------------------------------------------------------------------
// Root
export type RootProps = DialogPrimitive.DialogProps;

const overlayClasses =
  "bg-gray7 bg-opacity-20 z-10 fixed inset-0 animate-fadeIn";

export const Root = React.forwardRef<HTMLDivElement, RootProps>(
  ({ children, ...props }, ref) => {
    return (
      <DialogPrimitive.Root {...props}>
        <DialogPrimitive.Overlay className={overlayClasses} ref={ref} />
        {children}
      </DialogPrimitive.Root>
    );
  }
);

// ------------------------------------------------------------------
// Content

const contentClasses = stackClasses({}, [
  "gap-2 shadow-6 z-10 min-w-[350px] max-w-[500px] fixed left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] focus:outline-none",
]);

const cardClasses = stackClasses({}, [
  "bg-layer-1 rounded-md border border-gray7 p-6",
]);

export type ContentProps = DialogPrimitive.DialogContentProps & {
  Above?: React.ReactNode;
  Below?: React.ReactNode;
};

export const Content = React.forwardRef<HTMLDivElement, ContentProps>(
  ({ children, Above, Below, className, ...props }, ref) => {
    return (
      <DialogPrimitive.Content
        className={
          className ? twMerge(contentClasses, className) : contentClasses
        }
        ref={ref}
        {...props}
      >
        {Above}
        <div className={cardClasses}>{children}</div>
        {Below}
      </DialogPrimitive.Content>
    );
  }
);

// ------------------------------------------------------------------
// Trigger

export type TriggerProps = DialogPrimitive.DialogTriggerProps;

export const Trigger = DialogPrimitive.Trigger;

// ------------------------------------------------------------------
// CloseButton

export type CloseButtonProps = ButtonProps;

export const CloseButton = React.forwardRef<
  HTMLButtonElement,
  CloseButtonProps
>((props, ref) => {
  return (
    <DialogPrimitive.Close asChild>
      <Button variant="ghost" square ref={ref} {...props}>
        <Icon label="Schließe den Dialog">
          <Cross2Icon />
        </Icon>
      </Button>
    </DialogPrimitive.Close>
  );
});

// ------------------------------------------------------------------
// Header

const headerClasses = rowClasses({}, ["flex justify-between items-baseline"]);

export type HeaderProps = { children: React.ReactNode; className?: string };

export const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({ children, className }, ref) => {
    return (
      <header
        ref={ref}
        className={
          className ? twMerge(headerClasses, className) : headerClasses
        }
      >
        <Title asChild>
          <Heading size="extra-small">{children}</Heading>
        </Title>
      </header>
    );
  }
);

// ------------------------------------------------------------------
// ActionButton
type ActionButtonProps = ButtonProps;

const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ children, style, ...props }, ref) => {
    return (
      <Button
        variant="secondary"
        style={style}
        type="submit"
        ref={ref}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

// ------------------------------------------------------------------
// ButtonRow

const buttonRowClasses = rowClasses({}, ["gap-3 mt-5 justify-end"]);

export const ButtonRow = React.forwardRef<HTMLButtonElement, SubmitButtonProps>(
  ({ className, ...props }, ref) => (
    <div
      className={
        className ? twMerge(buttonRowClasses, className) : buttonRowClasses
      }
    >
      <Close asChild>
        <ActionButton variant="neutral" className="colorScheme-gray">
          Abbrechen
        </ActionButton>
      </Close>
      <SubmitButton {...props} ref={ref} />
    </div>
  )
);

// ------------------------------------------------------------------
// Title

export type TitleProps = DialogPrimitive.DialogTitleProps;

export const Title = DialogPrimitive.Title;

// ------------------------------------------------------------------

// ------------------------------------------------------------------
// Description

export type DescriptionProps = DialogPrimitive.DialogDescriptionProps;

export const Description = DialogPrimitive.Description;

// ------------------------------------------------------------------
// Close

export type CloseProps = DialogPrimitive.DialogCloseProps;

export const Close = DialogPrimitive.Close;

// ------------------------------------------------------------------
// Portal

export type PortalProps = DialogPrimitive.PortalProps;

export const Portal = DialogPrimitive.Portal;

// ------------------------------------------------------------------
