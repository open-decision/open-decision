import * as React from "react";
import { ResetPasswordCard } from "../../src/features/Auth/components/AuthCards/ResetPasswordCard";
import { getAuthLayout } from "../../src/features/Auth/components/AuthLayout";

export default function ResetPassword(): JSX.Element {
  return <ResetPasswordCard />;
}

ResetPassword.getLayout = getAuthLayout;
