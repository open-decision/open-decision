import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button, Icon, ButtonProps } from "../../index";
import { X } from "../../icons";
import { styled, keyframes, StyleObject } from "../../stitches";
import { Heading } from "../../Heading";
import { Box } from "../../Box";
import { ColorKeys } from "../../internal/utils";
import { LoadingSpinner } from "../../LoadingSpinner/LoadingSpinner";
import { Stack } from "../../Layout/Stack";

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
  layer: "1",
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
  zIndex: "$10",

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

function Header({ children, css }: HeaderProps) {
  return (
    <Box
      as="header"
      css={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        ...css,
      }}
    >
      <Dialog.Title asChild>
        <Heading size="extra-small">{children}</Heading>
      </Dialog.Title>
    </Box>
  );
}

type ActionButtonProps = { colorScheme?: ColorKeys } & ButtonProps;

const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(
  function ActionButton(
    { colorScheme = "primary", children, css, ...props },
    ref
  ) {
    return (
      <Button
        variant="secondary"
        css={{
          colorScheme,
          ...css,
        }}
        type="submit"
        ref={ref}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

const ButtonRow = (props: SubmitButtonProps) => (
  <Stack
    css={{
      flexDirection: "row",
      gap: "$3",
      justifyContent: "flex-end",
      marginTop: "$5",
    }}
  >
    <Dialog.Close asChild>
      <Dialog.ActionButton variant="neutral" colorScheme="gray">
        Abbrechen
      </Dialog.ActionButton>
    </Dialog.Close>
    <Dialog.SubmitButton {...props} />
  </Stack>
);

type SubmitButtonProps = ButtonProps & {
  isLoading: boolean;
  colorScheme?: ColorKeys;
};

const SubmitButton = ({
  isLoading,
  children,
  colorScheme,
  css,
  ...props
}: SubmitButtonProps) => (
  <ActionButton
    type="submit"
    colorScheme={colorScheme}
    css={{ focusColor: colorScheme ? `$${colorScheme}11` : undefined, ...css }}
    {...props}
  >
    {isLoading ? <LoadingSpinner colorScheme={colorScheme} /> : children}
  </ActionButton>
);

export const Dialog = {
  Root: DialogRoot,
  Trigger: DialogPrimitive.Trigger,
  Content: DialogContent,
  Title: DialogPrimitive.Title,
  Description: styled(DialogPrimitive.Description, { color: "$gray11" }),
  Close: DialogPrimitive.Close,
  CloseButton,
  Header,
  SubmitButton,
  ActionButton,
  ButtonRow,
};

export type DialogRootProps = DialogPrimitive.DialogProps;
export type DialogTriggerProps = DialogPrimitive.DialogTriggerProps;
export type DialogContentProps = React.ComponentProps<typeof StyledContent>;
export type DialogTitleProps = DialogPrimitive.DialogTitleProps;
export type DialogDescriptionProps = DialogPrimitive.DialogDescriptionProps;
export type DialogCloseProps = DialogPrimitive.DialogCloseProps;
export type DialogCloseButtonProps = Partial<ButtonProps>;
export type HeaderProps = { children: React.ReactNode; css?: StyleObject };
