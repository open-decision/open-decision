import * as React from "react";
import { RegisterCard } from "../../src/features/Auth/components/AuthCards";
import { getAuthLayout } from "../../src/features/Auth/components/AuthLayout";

export default function Register(): JSX.Element {
  return <RegisterCard />;
}

Register.getLayout = getAuthLayout;
