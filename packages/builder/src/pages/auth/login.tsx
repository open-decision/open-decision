import * as React from "react";
import { LoginCard } from "../../features/Auth/components/AuthCards";
import { getAuthLayout } from "../../features/Auth/components/AuthLayout";

export default function Login(): JSX.Element {
  return <LoginCard />;
}

Login.getLayout = getAuthLayout;
