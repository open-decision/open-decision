import * as React from "react";
import {
  Box,
  Button,
  ButtonProps,
  Dialog,
  Heading,
  styled,
} from "@open-legal-tech/design-system";
import { ColorKeys } from "@open-legal-tech/design-system/src/internal/utils";
import { LoadingSpinner } from "components/LoadingSpinner";

const Content = styled(Dialog.Content, {
  minWidth: "350px",
  paddingTop: "$2",
  zIndex: "$10",
  maxWidth: "500px",
});

type HeaderProps = { children: React.ReactNode };

const Header = ({ children }: HeaderProps) => (
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
    <DashboardDialog.CloseButton />
  </Box>
);

type SubmitButtonProps = ButtonProps & {
  isLoading: boolean;
  colorScheme?: ColorKeys;
};

const SubmitButton = ({
  isLoading,
  children,
  colorScheme,
  ...props
}: SubmitButtonProps) => (
  <Button
    size="small"
    variant="secondary"
    css={{
      colorScheme,
      alignSelf: "end",
      marginTop: "$6",
      ...props.css,
    }}
    type="submit"
    {...props}
  >
    {isLoading ? <LoadingSpinner colorScheme={colorScheme} /> : children}
  </Button>
);

const Trigger = ({ children }: DashboardDialogProps) => {
  React.Children.only(children);

  return <Dialog.Trigger asChild>{children}</Dialog.Trigger>;
};

export const DashboardDialog = {
  ...Dialog,
  Content,
  Header,
  SubmitButton,
  Trigger,
};

export type DashboardDialogProps = { children?: React.ReactNode };
