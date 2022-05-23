import { NextPage } from "next";
import * as React from "react";
import { Layout } from "../../../components";

export function getAuthLayout(page: NextPage) {
  return (
    <Layout
      css={{
        background: "url(/background_pattern_auth_pages.svg)",
        backgroundSize: "cover",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {page}
    </Layout>
  );
}
