import * as React from "react";
import { Layout } from "../../../components";

export function getAuthLayout(page: React.ReactElement) {
  return (
    <Layout className="bg-cover items-center justify-center bg-[url(/background_pattern_auth_pages.svg)]">
      {page}
    </Layout>
  );
}
