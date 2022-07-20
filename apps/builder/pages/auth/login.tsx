import Head from "next/head";
import * as React from "react";
import { LoginCard } from "../../features/Auth/components/AuthCards";
import { getAuthLayout } from "../../features/Auth/components/AuthLayout";

export default function Login(): JSX.Element {
  return (
    <>
      <Head>
        <title>Open Decision Login</title>
      </Head>
      <LoginCard />
    </>
  );
}

Login.getLayout = getAuthLayout;
