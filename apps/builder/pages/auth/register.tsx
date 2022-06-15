import * as React from "react";
import { RegisterCard } from "../../features/Auth/components/AuthCards";
import { getAuthLayout } from "../../features/Auth/components/AuthLayout";

export default function Register(): JSX.Element {
  return <RegisterCard />;
}

Register.getLayout = getAuthLayout;
