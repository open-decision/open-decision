import { Stack } from "@open-decision/design-system";
import { BaseHeader } from "components";
import { Layout } from "../Layout";
import { ErrorCard, ErrorCardProps } from "./ErrorCard";

export function FullPageErrorFallback(props: ErrorCardProps) {
  return (
    <Layout>
      <BaseHeader />
      <Stack css={{ flex: 1 }} center>
        <ErrorCard {...props} />
      </Stack>
    </Layout>
  );
}
