import Head from "next/head";
import * as React from "react";
import { RegisterCard } from "../../features/Auth/components/AuthCards";
import { getAuthLayout } from "../../features/Auth/components/AuthLayout";

export default function Register(): JSX.Element {
  return (
    <>
      <Head>
        <title>Open Decision Register</title>
      </Head>
      <RegisterCard />
    </>
  );
}

Register.getLayout = getAuthLayout;
