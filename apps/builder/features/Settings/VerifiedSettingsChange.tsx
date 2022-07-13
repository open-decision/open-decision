import * as React from "react";
import {
  VerfiyLoginDialogProps,
  VerifyLoginDialog,
} from "../Auth/components/VerifyLoginDialog";

type Props = {
  children: React.ReactNode;
  email: string;
} & VerfiyLoginDialogProps;

export function VerifiedSettingsChange({ children, email, ...props }: Props) {
  return (
    <>
      {props.open ? <VerifyLoginDialog email={email} {...props} /> : null}
      {children}
    </>
  );
}
