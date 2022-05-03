import * as React from "react";
import { ForgotPasswordCard } from "../../features/Auth/components/AuthCards";
import { getAuthLayout } from "../../features/Auth/components/AuthLayout";

export default function ForgotPassword(): JSX.Element {
  return <ForgotPasswordCard />;
}

ForgotPassword.getLayout = getAuthLayout;
