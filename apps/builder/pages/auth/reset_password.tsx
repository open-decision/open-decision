import Head from "next/head";
import * as React from "react";
import { ResetPasswordCard } from "../../features/Auth/components/AuthCards/ResetPasswordCard";
import { getAuthLayout } from "../../features/Auth/components/AuthLayout";

export default function ResetPassword(): JSX.Element {
  return (
    <>
      <Head>
        <title>Open Decision Passwort zurücksetzen</title>
      </Head>
      <ResetPasswordCard />
    </>
  );
}

ResetPassword.getLayout = getAuthLayout;
