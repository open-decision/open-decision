import Head from "next/head";
import * as React from "react";
import { ForgotPasswordCard } from "../../features/Auth/components/AuthCards";
import { getAuthLayout } from "../../features/Auth/components/AuthLayout";

export default function ForgotPassword(): JSX.Element {
  return (
    <>
      <Head>
        <title>Open Decision Passwort vergessen</title>
      </Head>
      <ForgotPasswordCard />
    </>
  );
}

ForgotPassword.getLayout = getAuthLayout;
