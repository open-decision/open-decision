import * as React from "react";
import { ForgotPasswordCard } from "../../src/features/Auth/components/AuthCards";
import { getAuthLayout } from "../../src/features/Auth/components/AuthLayout";

export default function ForgotPassword(): JSX.Element {
  return <ForgotPasswordCard />;
}

ForgotPassword.getLayout = getAuthLayout;
