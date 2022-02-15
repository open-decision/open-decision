import * as React from "react";
import {
  Button,
  ButtonProps,
  Dialog,
  styled,
} from "@open-legal-tech/design-system";
import { ColorKeys } from "@open-legal-tech/design-system/src/internal/utils";
import { LoadingSpinner } from "components/LoadingSpinner";

const Content = styled(Dialog.Content, {
  paddingTop: "$2",
});

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
  SubmitButton,
  Trigger,
};

export type DashboardDialogProps = { children?: React.ReactNode };
