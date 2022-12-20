import * as React from "react";
import { Layout } from "../../components";

export function getDashboardLayout(page: React.ReactElement) {
  return (
    <Layout className="grid overflow-hidden grid-rows-[max-content_max-content_1fr] gap-7 grid-cols-[1fr_200px_minmax(600px,_1fr)_1fr]">
      {page}
    </Layout>
  );
}
