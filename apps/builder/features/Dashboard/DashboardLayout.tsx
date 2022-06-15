import { NextPage } from "next";
import * as React from "react";
import { Layout } from "../../components";

export function getDashboardLayout(page: NextPage) {
  return (
    <Layout
      css={{
        display: "grid",
        overflow: "hidden",
        gridTemplateRows: "max-content max-content 1fr",
        gridTemplateColumns: "1fr 200px minmax(600px, 1fr) 1fr",
        columnGap: "$7",
      }}
    >
      {page}
    </Layout>
  );
}
