import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button, Icon, ButtonProps } from "../../index";
import { X } from "../../icons";
import { styled, keyframes } from "../../stitches";
import { Heading } from "../../Heading";
import { Box } from "../../Box";

function DialogRoot({ children, ...props }: DialogRootProps) {
  return (
    <DialogPrimitive.Root {...props}>
      <StyledOverlay />
      {children}
    </DialogPrimitive.Root>
  );
}

const contentShow = keyframes({
  "0%": { opacity: 0, transform: "translate(-50%, -48%) scale(.96)" },
  "100%": { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
});

const StyledContent = styled(DialogPrimitive.Content, {
  boxShadow: "$6",
  borderRadius: "$md",
  backgroundColor: "$gray1",
  padding: "$5",
  minWidth: "350px",
  zIndex: "$10",
  maxWidth: "500px",

  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",

  "&:focus": { outline: "none" },

  "@media (prefers-reduced-motion: no-preference)": {
    animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  },
});

const overlayShow = keyframes({
  "0%": { opacity: 0 },
  "100%": { opacity: 1 },
});

const StyledOverlay = styled(DialogPrimitive.Overlay, {
  backgroundColor: "$grayA7",
  position: "fixed",
  inset: 0,

  "@media (prefers-reduced-motion: no-preference)": {
    animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  },
});

function DialogContent({ children, ...props }: DialogContentProps) {
  return <StyledContent {...props}>{children}</StyledContent>;
}

function CloseButton(props: Partial<ButtonProps>) {
  return (
    <DialogPrimitive.Close asChild>
      <Button variant="ghost" square alignByContent="right" {...props}>
        <Icon label="Schließe den Dialog">
          <X />
        </Icon>
      </Button>
    </DialogPrimitive.Close>
  );
}

function Header({ children }: HeaderProps) {
  return (
    <Box
      as="header"
      css={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "$6",
        alignItems: "center",
      }}
    >
      <Dialog.Title asChild>
        <Heading size="extra-small">{children}</Heading>
      </Dialog.Title>
      <Dialog.CloseButton />
    </Box>
  );
}

export const Dialog = {
  Root: DialogRoot,
  Trigger: DialogPrimitive.Trigger,
  Content: DialogContent,
  Title: DialogPrimitive.Title,
  Description: DialogPrimitive.Description,
  Close: DialogPrimitive.Close,
  CloseButton,
  Header,
};

export type DialogRootProps = DialogPrimitive.DialogProps;
export type DialogTriggerProps = DialogPrimitive.DialogTriggerProps;
export type DialogContentProps = React.ComponentProps<typeof StyledContent>;
export type DialogTitleProps = DialogPrimitive.DialogTitleProps;
export type DialogDescriptionProps = DialogPrimitive.DialogDescriptionProps;
export type DialogCloseProps = DialogPrimitive.DialogCloseProps;
export type DialogCloseButtonProps = Partial<ButtonProps>;
export type HeaderProps = { children: React.ReactNode };
