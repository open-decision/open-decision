import * as React from "react";
import {
  VerfiyLoginDialogProps,
  VerifyLoginDialog,
} from "../Auth/components/VerifyLoginDialog";

type Props = {
  children: React.ReactNode;
} & VerfiyLoginDialogProps;

export function VerifiedSettingsChange({ children, ...props }: Props) {
  return (
    <>
      <VerifyLoginDialog {...props} />
      {children}
    </>
  );
}
